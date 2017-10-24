  var parsedObject;

  Handlebars.registerHelper('ifOverflow', function(value, options) {
    return value.length > 5 ?
      options.fn(this) :
      options.inverse(this);
  });

  // Check for Empty Strings
  Handlebars.registerHelper('ifnonempty', function(conditional, options) {
    conditional = conditional || '';
    if(conditional != '') {
      return options.fn(this);
    }else{
      return '';
    }
  });

  Handlebars.registerHelper('ifMultipleElements', function(examples, options) {
    var isMultiple = false;

    for(key in examples){
        if(examples[key].length > 1){
            isMultiple = true;
            break;
        }
    }

    if(isMultiple == true){
      return options.fn(this);
    }
    else{
      return options.inverse(this);
    }

  });

  // Concatenate Array
  Handlebars.registerHelper('concat', function(context = [], options) {
    return context.join(', ');
  });

  Handlebars.registerHelper('ifeven', function(val, options) {
      if(val%2 == 0){
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });

    Handlebars.registerHelper('ifarray', function(val, options) {
        if (Object.prototype.toString.call( val ) === '[object Array]'){
          return options.fn(this)
        }
        else{
          return options.inverse(this);
        }
      });

      Handlebars.registerHelper('ifobject', function(val, options) {
        if (Object.prototype.toString.call( val ) === '[object Object]'){
          return options.fn(this)
        }
        else{
          return options.inverse(this);
        }
        });

Handlebars.registerHelper('ifequal', function(v1, v2, options) {
  if(Object.prototype.toString.call( v1 ) === '[object Array]'){
    v1 = v1[0];
  }
  if(Object.prototype.toString.call( v2 ) === '[object Array]'){
    v2 = v2[0];
  }

  if(v1.toString().toLowerCase() === v2.toString().toLowerCase()) {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper('getfirst', function(v1, options) {
  if(Object.prototype.toString.call( v1 ) === '[object Array]' && v1.length > 0){
    return v1[0];
  }
  return '';
});

Handlebars.registerHelper('getCategoryBacklinks', function(category,options) {
  var categoryValues = category.join(",");
  for (var i = 0; i < category.length; i++) {
         category[i] = category[i].toLowerCase();
     }
   categoryValues = category.join(',');


  return '<a class="link" href="{{ site.baseurl }}/findSensor.html?' +
            'category=' + encodeURIComponent(categoryValues) + '">' + 'See all ' + '</a>';

});

Handlebars.registerHelper('getKitsBacklinks', function(kit, options) {
    return '<a class="link" href="{{ site.baseurl }}/findSensor.html?' +
            'category=' + encodeURIComponent(kit) + '">' + kit + '</a>';
});

Handlebars.registerHelper('language', function(context) {
    if(context == 'Node.js')
      return 'javascript'
    if(context == 'C++')
      return 'cpp'
    if(context == 'Java')
      return 'java'
    if(context == 'Python')
      return 'python'
    if(context == 'C')
      return 'cpp'
});


Handlebars.registerHelper('imagelinkDetail', function(source) {
  if(source){
    return '{{site.data.global.imageUrl}}/' + source;
  }
  else
    return "{{site.baseurl}}/assets/images/FPO-Detail.png"
});

Handlebars.registerHelper('codeSnippetFolder', function(context) {
    if(context == 'Node.js')
      return 'javascript'
    if(context == 'C++')
      return encodeURIComponent('c++');
    if(context == 'Java')
      return 'java'
    if(context == 'Python')
      return 'python'
    if(context == 'C')
      return 'c'
});

Handlebars.registerHelper('sourceURL', function(source) {
    switch(source) {
    case "Java":
          return '{{ site.data.global.apiUrl }}/{{site.data.global.apiurl_java}}';
          break;
    case "Python":
          return '{{ site.data.global.apiUrl }}/{{site.data.global.apiurl_python}}';
          break;
    case "C++":
          return '{{ site.data.global.apiUrl }}/{{site.data.global.apiurl_Cpp}}';
          break;
    case "Node.js":
          return '{{ site.data.global.apiUrl }}/{{site.data.global.apiurl_node}}';
          break;
    case "C":
          return '{{ site.data.global.apiUrl }}/{{site.data.global.apiurl_C}}';
          break;
    default:
          return '{{ site.data.global.apiUrl }}/{{site.data.global.apiurl_default}}';
  }
});

Handlebars.registerHelper('imagelink', function(source) {
  if(source){
    return '{{site.data.global.imageUrl}}/' + source;
  }
  else
    return "{{site.baseurl}}/assets/images/FPO.png"
});

function ResizeImage(sourceimage){
  var $container = $(sourceimage).parent();

  var containerRatio = $container.width()/$container.height();
  var imageRatio = sourceimage.width/sourceimage.height;

  if(containerRatio > imageRatio) {
        $(sourceimage).css({ "height" : "98%", "width" : "auto" });
    }
    else{
        $(sourceimage).css({ "height" : "auto", "width" : "100%" });
    }

    $(sourceimage).show();
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return "";
}
