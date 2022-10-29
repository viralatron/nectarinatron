import getXMLStreams from "../Helper";

test("testa a requisição e retorna XML ou uma mensagem de erro", () => {
  const XMLData = getXMLStreams();
  expect(XMLData).toBe("https://www.scenestream.net/demovibes/xml/streams/");
});
