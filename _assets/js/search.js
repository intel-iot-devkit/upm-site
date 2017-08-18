var searchterm =[];

$(document).ready(function(){
  GetFacetsData();
  GetLunrIndex();
});

function GetLunrIndex(){
  $.ajax({
        cache: true, // Set to True
        url: '{{ site.baseurl }}/assets/content/LunrIndex.json?_={{site.data.global.ajaxVersion}}',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
          PrepareLunrIndex(response);
          var filterString = '';
          var category = getQueryVariable('category') || '';
          if(category != ''){
            var categoryValue = category.split(',')

            for(i=0; i< categoryValue.length; i++){
              var $checkbox = $('input[type="checkbox"][value="' + (categoryValue[i]) + '"]');
              $checkbox.prop("checked", true);

              /* Expand the collapsed, so the checked filter is visible */
              var $parent = $checkbox.parentsUntil(".panel-default", ".panel-body");

              if($parent.hasClass("read-more")){
                $parent.siblings(".show-more").click();
              }
            }
            filterString = PrepareFilter();
          }
          Search(filterString);

        },
        error: function (r) {
            alert('Error! Please try again.' + r.responseText);
            console.log(r);
        }
    });
}

function FilterLurData(){
  Search(PrepareFilter());
}

function PrepareFilter(){
  var selectedFilters = [];

  if($filterCheckboxes.filter(':checked').length > 0){
    $filterCheckboxes.filter(':checked').each(function() {
      var key = this.name.replace( /\s/g, '');

      if (!selectedFilters.hasOwnProperty(key)) {
        selectedFilters[key] = [];
      }

      selectedFilters[key].push(this.value.replace(/\s+/g,"_|_"));

    });
  }
  else{
    selectedFilters = null;
  }
  return selectedFilters;
}


/* Fed search item lunr to initiate search */

function Search(searchCategories){
  var allResults = null;

  if(searchCategories){

    for(var key in searchCategories){

      var filter = Object();
      var fieldfilter = new Object();
      fieldfilter[key] = { boost: 1 }
      filter["fields"] = fieldfilter;

      var results = [];
      results.push(idx.search(searchCategories[key].join(' '), filter));

      if(results.length > 0){
        results = results[0];

        if(!allResults){
          allResults = results;
        }
        else{

          allResults = allResults || [];

          allResults = Intersect(allResults, results);
        }

      }

    }
  }

  //We cannot get reference on innitial load, that is why a different way to parse empty search
  else{
      allResults = [];
      for (var key in idx.documentStore.docs){
        allResults.push(idx.documentStore.docs[key]);
      }
  }

  BindSensorResult(allResults);
}

function Intersect(arr1, arr2){
  var result = [];

  for(var z=0;z<arr1.length;z++){
    for(var y=0;y<arr2.length;y++){
        if(arr1[z].ref === arr2[y].ref){
          result.push(arr1[z]);
          break;
        }
    }

  }

  return result;
}

//Pagination on find sensor page

function bindPagination(){
  $(".page_navigation").show();
    $('#findSensor').pajinate({
        num_page_links_to_display : 6,
        items_per_page : 50
    });
}

function hidePagination(){
    $(".page_navigation").hide();
}

//Display results on find sensor page
function BindSensorResult(results) {
    var generatedhtml = '';
    var template = Handlebars.compile($('#findSensorDetail').html());
    var $searchresultview = $('#findSensor .content');

     $searchresultview.html('')
     var sensorList = [];

    if(results.length > 0){

      if(results[0].ref){
        for (var i=0; i < results.length; i++){
            sensorList.push(results[i].doc);
        }
      }
      else{
        sensorList = results;
      }

       $searchresultview.html(template(sensorList));
       bindPagination();
    }
    else{
      var html = '<div class="no-results">No sensors match the selected filters.</div>';
      $searchresultview.html(html);
      // $('html,body').animate({scrollTop:$('.no-results').offset().top-150}, 500);

      hidePagination();
    }
}

// $(document).on('click', '.page_link, .next_link, .last_link, .first_link, .previous_link', function() {
//   $('html,body').animate({scrollTop:$('.right-container').offset().top - 300}, 500);
// });

jQuery.ui.autocomplete.prototype._resizeMenu = function () {
  var ul = this.menu.element;
  ul.outerWidth(this.element.outerWidth());
}

if($('#searchBox').length > 0){
  $('#searchBox').autocomplete({
    /* Break down into smaller functions */
    source: function(request, response){
      var results = idx.search(request.term,{
      fields:{
          PartNumbers: {boost: 2},
          Brief:{boost:2}
        },
        expand: true
      });
      if(results.length == 0){
        var message = new Object();
        message.ref = -1;
        results.push(message);
      }
      response(results);
    },
    focus: function( event, ui ) {
      var sensorId = ui.item.ref || '';

      if(sensorId.length > 0){
        $('#searchBox').val( ui.item.doc["Brief"]);
      }
      return false;
    },
    select:function(event, ui){
      event.preventDefault();

      var sensorId = ui.item.ref || '';

      if(sensorId.length > 0){
        location.href = "{{ site.baseurl }}/sensorDetail.html?name="+ ui.item.ref;
      }
    }
  })
  .autocomplete( "instance" )._renderItem = function( ul, item ) {
    if(item.ref != -1 ){
      return $( "<li>" )
        .addClass("ui-menu-item")
        .attr( "data-id", (item.ref))
        .append( "<div class='ui-menu-item-wrapper'>" + item.doc.Brief + " (" + ConcatenateArray(item.doc.PartNumbers) + ")</div>" )
        .appendTo( ul );
    }else{
      return $( "<li>" )
        .addClass("ui-autocomplete-noresult")
        .append( "<div class='ui-menu-item-wrapper'>No Results Found !!</div>" )
        .appendTo( ul );
    }
  };

  /* Close dropdown on window resize */
  $(window).resize(function() {
    $('#searchBox').autocomplete( "close" );
  });
}

/* Load Facets Data*/

function GetFacetsData(){
  $.ajax({
        cache: true,
        url: '{{ site.baseurl }}/assets/content/facets.json?_={{site.data.global.ajaxVersion}}',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
          PrepareFacetOptions(response);
          $filterCheckboxes = $('#leftSection input[type="checkbox"]');
        },
        error: function (r) {
            alert('Error! Please try again.' + r.responseText);
            console.log(r);
        }
    });
}

 function PrepareFacetOptions(source){
    var templateScript = $('#accordianTemplate').html();
    var template = Handlebars.compile(templateScript);
    var rendered = template(source);
    $('#accordion').html(rendered);
    checkSeeMoreOption();
}


function checkSeeMoreOption(){
  var panelBodyContainer = $('.panel-body');
  for(i=0; i< panelBodyContainer.length; i++){
      if(panelBodyContainer[i].children.length  > 5){
          panelBodyContainer[i].nextElementSibling.style.display="block"
          panelBodyContainer[i].style.height="160px"
      }
      else{
        panelBodyContainer[i].style.height="auto";
      }
    }
}

$("body").on('click', '.show-more', LoadMoreData);

function LoadMoreData(){
    $(this).parent().find('.panel-body').toggleClass('read-less').toggleClass('read-more');
    if($(this).text()=='See more...') $(this).text('See less...');
    else  $(this).text('See more...');
};

$('#menu-hide').click(function(){
  if($('.left-container').hasClass('open')){
    $('.left-container').removeClass('open')
  }
  else
    $('.left-container').addClass('open')
})

$(document).ready(function(){
  $('#menu-hide').click(function(){
    $(this).toggleClass('open');
  });
});
