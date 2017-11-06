$(() => {
  return $.get({
    url: '{{ site.baseurl }}/assets/content/sensorDetail.json?_={{site.data.global.ajaxVersion}}',
    cache: true
  }).then(res => {
    loadSensorDetailData(getQueryVariable('name'), res);
    initCarousel();
    initCodeSamples();
  }, err => {
    alert(err); // FIXME
  });
});


let loadSensorDetailData = (id, res) => {
  let sensor = res.find(sensor => sensor.id === id);
  if (!sensor) {
      return;
  }

  let templateScript = $('#sensorDetailPageTemplate').html() || '';
  let template = Handlebars.compile(templateScript);

  let html = template(sensor);
  $('#sensorDetailPage').html(html);
};

let initCarousel = () => {
  if (!$('.carousel .item').length) {
    $('#carousel-section').hide();
    return;
  }

  $('.carousel .item').first().addClass('active');
  $('.carousel .carousel-indicators li').first().addClass('active');
  $('.carousel').carousel({ interval: 2000 });
};

/**
 * Fetch a code sample
 *
 * @param {String} lang - sample programming language
 * @param {String} filename
 * @return {Promise<String>}
 */
let fetchCodeSample = (lang, filename) => {
  return $.get({
    url: `{{site.data.global.codeSnippetUrl}}/${lang}/${filename}`
  }).then(res => {

    // strip comments
    let code = lang === 'python' ?
      res.replace(/(#.*?\n){4,}/g, '') :
      res.replace(/\/\*[^]*?\*\//g, ''); // CXX, Java, JavaScript

    return code.replace(/^[\s]*$\n/m, '').replace(/\t/g, '  ');
  });
};

let initCodeSamples = () => {
  $('#codeSection li').each((i, el) => {
    let $el = $(el);

    let lang = $el.attr('data-parent');
    let filename = $el.attr('data-value');

    let $code = $(`#codeSection [role='tabpanel'][data-parent='${lang}'] code`);

    return fetchCodeSample(lang, filename).then(code => {
      $code.text(code);
      hljs.highlightBlock($code[0]);
    });
  });
};
