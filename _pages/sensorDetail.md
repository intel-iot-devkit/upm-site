---
layout: innerlayout
breadcrumb: true
title_text : Find Sensors
permalink: /sensorDetail.html
sensor_name: true
sensor_detail: true
---

<div id="sensorDetailPage">
<script type="text/javascript">
/* This Function is used to Resize Image on Window Resize */
  $(window).resize(function() {
    ResizeImage($("#imgMainSensor")[0]);
  });
</script>
    <script id="sensorDetailPageTemplate" type="text/x-handlebars-template">
		{% include SensorDetail/description.html %}
{% raw %}
    	{{#if Specifications}}
{% endraw %}    	
			{% include SensorDetail/specifications.html %}
{% raw %} 			
		{{/if}}		
{% endraw %}    

		{% include SensorDetail/documentation.html %}
		{% include SensorDetail/code-section.html %}

{% raw %}
    	{{#if Platforms}}
{% endraw %}    	
		{% include SensorDetail/platforms.html %}
{% raw %} 			
		{{/if}}		
{% endraw %}    

{% raw %}
    	{{#if Kits}}
{% endraw %}    	
			{% include SensorDetail/starterkits.html %}
{% raw %} 			
		{{/if}}		
{% endraw %}    
{% raw %}
    	{{#if Platforms}}
{% endraw %}    	
		{% include SensorDetail/examples.html %}
{% raw %} 			
		{{/if}}		
{% endraw %}    
    </script>
</div>

<script src="{{ site.baseurl }}/assets/js/library/jquery-ui.min.js"></script>
<script src="{{ site.baseurl }}/assets/js/library/elasticlunr.js"></script>
<script src="{{ site.baseurl }}/assets/js/common.js?v={{site.data.global.resourceVersion}}"></script>  
<script src="{{ site.baseurl }}/assets/js/sensorDetail.js?v={{site.data.global.resourceVersion}}"></script>
