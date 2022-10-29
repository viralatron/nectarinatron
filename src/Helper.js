const demosceneURL = "https://www.scenestream.net/demovibes/xml/";
export const getXMLStreams = async () => {
  //testar a url e tratar potenciais erros
  const streamsURL = "https://www.scenestream.net/demovibes/xml/streams/";
  // tentar usando fetch
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = () => {
    if (this.readyState === 4 && this.status === 200)
      console.log(xhttp.responseText);
  };
  xhttp.open("GET", streamsURL, true);
  xhttp.setRequestHeader("Accept", "application/xml");
  xhttp.setRequestHeader("Access-Control-Allow-Methods", "GET");
  xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhttp.send();

  return streamsURL;
};

export const getXML = (path) => {
  const headers = new Headers();
  //   headers.append("origin", "localhost");
  //   headers.append("Accept", "text/plain");
  //   headers.append("Access-Control-Allow-Methods", "GET");
  //   headers.append("Access-Control-Allow-Origin", "http://localhost:3000");
  //   headers.append("Access-Control-Allow-Origin", "https://localhost:3000");
  const options = { headers };
  return fetch(`${demosceneURL}${path}/`, options)
    .then((response) => response.text())
    .then((str) => new window.DOMParser().parseFromString(str, "text/xml"))
    .then((data) => console.log(data));
  // its something. still no cors solution tho
  //   return fetch(
  //     `https://cors-anywhere.herokuapp.com/${demosceneURL}${path}/`,
  //     options
  //   )
  //     .then((response) => response.text())
  //     .then((str) => new window.DOMParser().parseFromString(str, "text/xml"))
  //     .then((data) => console.log(data));
  //   // its something. still no cors solution tho
};
