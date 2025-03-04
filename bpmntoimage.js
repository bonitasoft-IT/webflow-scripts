//document.getElementById('btn-open-file').addEventListener('change', handleFileSelect, false);


function log(message, ...optionalParams) {
  console.info('[DEMO] ' + message, ...optionalParams);
}

// at least on chromium, performance.now() returns a lot of digits. We don't care to have such a precision here, so round to only keep milliseconds
function round(duration) {
  return duration.toFixed(0)
}

function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  const file = evt.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    try {
      bpmnVisualization.load(reader.result);
      document.getElementById('loading-info').classList.remove('hidden');
      // TODO we probably don't need it, just select span child
      document.getElementById('loaded-file-name').innerHTML = `<code>${file.name}</code>`;
    } catch (error) {
      //console.error('Unable to load the BPMN diagram.', error);
      window.alert(`Unable to load the BPMN diagram. \n\n${error.message}`);
    }
  };
  reader.readAsText(file);
}

const fetchStatusElt = document.getElementById('fetch-status');
function statusFetching(url) {
  fetchStatusElt.innerText = 'Fetching ' + url;
  fetchStatusElt.className = 'status-fetching';
  loadStatusElt.className = 'hidden';
}

function statusFetched(url, duration) {
  fetchStatusElt.innerText = `Fetch OK (${duration} ms): ${url}`;
  fetchStatusElt.className = 'toast toast-success';
}

function statusFetchKO(url, duration, error) {
  fetchStatusElt.innerText = `Unable to fetch (${duration} ms) ${url}. ${error}`;
  fetchStatusElt.className = 'toast toast-error';
}

const loadStatusElt = document.getElementById('load-status');
function statusLoadOK(duration) {
  loadStatusElt.innerText = `BPMN Load OK (${duration} ms)`;
  loadStatusElt.className = 'toast toast-success';
}

function statusLoadKO(duration, error) {
  loadStatusElt.innerText = `BPMN Load KO (${duration} ms). ${error}`;
  loadStatusElt.className = 'toast toast-error';
}

function loadBpmn(bpmn){
  const bpmnVisualization = new bpmnvisu.BpmnVisualization({ container: 'bpmn-container', navigation: { enabled: true } });
  bpmnVisualization.load(bpmn, {fit: { type: bpmnvisu.FitType.Center, margin: 10} } );
  //jQuery('.TexttoBPMN-bpmnvisu .Bloc-dynamic-Buttons').css('display', 'block');
}

function fetchBpmnContent(url) {
  log('Fetching BPMN content from url <%s>', url);
  const startTime = performance.now();
  statusFetching(url);
  return fetch(url)
  .then(response => {
    if (!response.ok) {
      throw Error(String(response.status));
    }
    return response.text();
  })
  .then(responseBody => {
    log('BPMN content fetched');
    statusFetched(url, round(performance.now() - startTime));
    return responseBody;
  })
  .catch(error => {
    statusFetchKO(url, round(performance.now() - startTime), error);
    throw new Error(`Unable to fetch ${url}. ${error}`);
  });
}

function loadBpmnFromUrl(url) {
    fetchBpmnContent(url)
        .then(bpmn => {
          const startTime = performance.now();
          try {
            log('Start loading Bpmn');
            loadBpmn(bpmn);
            log('Bpmn loaded from url <%s>', url);
            statusLoadOK(round(performance.now() - startTime));
          } catch (error) {
            statusLoadKO(round(performance.now() - startTime), error);
            throw new Error(`Unable to load ${url}. ${error}`);
          }
        })
    ;
  }
