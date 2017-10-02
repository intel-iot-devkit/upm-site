$(() => {
  let $searchBox = $('#searchBox').focus();
  let $accordion = $('#accordion');
  let $findSensor = $('#findSensor');
  let $searchResults = $findSensor.children('.content');
  let $pageNavigation = $('.page_navigation');

  let facetsTemplate = Handlebars.compile($('#accordianTemplate').html());
  let searchResultsTemplate = Handlebars.compile($('#findSensorDetail').html());

  /**
   * Fetch JSON and cache it on success for future requests
   *
   * @param {String} url
   * @return {Promise}
   */
  let cacheJson = url => {
    let data = null;

    return () => {
      return data ? Promise.resolve(data) : $.getJSON(url).then(res => data = res);
    };
  };

  let getFacetsData = cacheJson('{{ site.baseurl }}/assets/content/facets.json?_={{ site.data.global.ajaxVersion }}');
  let getSensorDetails = cacheJson('{{ site.baseurl }}/assets/content/sensorDetail.json?_={{ site.data.global.ajaxVersion }}');

  /**
   * Render filter selection sidebar
   *
   * @return {Promise<jQuery>}
   */
  let renderFacets = () => {
    return getFacetsData().then(data => {
      $accordion.html(facetsTemplate(data));
      $accordion.find('.facet-filter').on('change', e => {
        // filter was changed, update results
        console.log(e);
      });
    });
  };

  /**
   * Render a pre-filtered, pre-sorted set of search results
   *
   * @param {Array} [results]
   * @return {jQuery}
   */
  let renderSearchResults = (results = []) => {
    $searchResults.empty();
    var sensorList = [];

    if (results.length) {
      $searchResults.html(searchResultsTemplate(results));
      showPagination();
    } else {
      $searchResults.html('<div class="no-results">No sensors match the selected filters.</div>');
      hidePagination();
    }

    return $searchResults;
  };

  let showPagination = () => {
    $pageNavigation.show();
    $findSensor.pajinate({
        num_page_links_to_display : 10,
        items_per_page : 10
    });
  };

  let hidePagination = () => {
    $pageNavigation.hide();
  };

  renderFacets();
  getSensorDetails().then(renderSearchResults); // show all sensors by default

  // even though all results are available locally (search is not performed
  // remotely), debounce the input to prevent the UI from rapidly updating
  $searchBox.on('input', _.debounce(e => {
    let query = e.target.value.toLowerCase();

    getSensorDetails().then(sensorDetails => {
      if (!query) {
        return renderSearchResults(sensorDetails); // render all sensors
      }

      // FIXME: facet filters
      let results = _.chain(sensorDetails).filter(sensor => {
        return sensor.id.toLowerCase().includes(query) || sensor.Name.toLowerCase().includes(query);
      }).sortBy(sensor => {
        return Levenshtein.get(query, sensor.Name.toLowerCase());
      }).value();

      renderSearchResults(results);
    });

  }, 250));

});
