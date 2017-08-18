$(document).ready(function(){
	GetSensorData();
});

function loadSensorDetailData(sensorname,response){ // Pass sensorname
    for(var i =0; i<response.length; i++){
        var libraryresponse = response[i]["Sensor Class"]
        for (var key in libraryresponse){
            if (key == sensorname) {
                var item = libraryresponse[sensorname];
                item.Library = response[i].Library;
                var templateScript = $('#sensorDetailPageTemplate').html();
                var template = Handlebars.compile(templateScript);
                var rendered = template(item);
                $('#sensorDetailPage').html(rendered);
            }
        }
    }
}


// This method is applicable only on Search Detail Page
// AJAX call to get the json data from sensordetail json
function GetSensorData(){
  $.ajax({
        cache: true, // Set to True
        url: '{{ site.baseurl }}/assets/content/sensorDetail.json?_={{site.data.global.ajaxVersion}}',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
				 loadSensorDetailData(getQueryVariable('name'),response);
                 InitializeCarousel(response);
                 InitializeCodeSample();
            },
        error: function (r) {
            alert('Error! Please try again.' + r.responseText);
            console.log(r);
        }
    });
}

function InitializeCarousel(response){
    if($('.carousel .item').length){
        $('.carousel').find('.item').first().addClass('active');
        $('.carousel').find('.carousel-indicators li').first().addClass('active');
        $('.carousel').carousel({
            interval: 2000
        });
    }
    else
        $('#carousel-section').hide();
}

function InitializeCodeSample(){
    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        loadCodeSamples($(e.target).parent());
    });

    loadCodeSamples($('.nav-pills li:first'));
}


function loadCodeSamples(sender){
    var that = sender;
    var flag = that.attr("data-flag") || 'false';
    if(flag == 'false'){
    	$.ajax({
            cache: false,
            url: '{{site.data.global.codeSnippetUrl}}/'+ sender.attr("data-parent") + '/' + sender.attr("data-value").split(',')[0],
            success: function( response, status, xhr ){

								var purgedResponse = response;

								if(that.attr("data-parent") == "python"){
									/* Remove comments from Python */
									purgedResponse = response.replace(/(#.*?\n){4,}/g,'');
								}
								else{
									/* Remove Comments from Cxx/Java and Node */
									purgedResponse = response.replace(/\/\*[^]*?\*\//g,'');
								}

								purgedResponse = purgedResponse.replace(/^[\s]*$\n/m,'');

								$('#'+that.attr("data-id")).find("code").text(purgedResponse);
            		hljs.highlightBlock($('#' + that.attr("data-id")).find("code")[0]);
                    that.attr("data-flag","true");
            }
        });
    }
}
