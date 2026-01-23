function startStream(i) {
  const URL = "http://localhost:8080/stream" + i;

  const msgContainer = document.getElementById("stream" + i);
  const es = new EventSource(URL);
  es.onmessage = (e) => {
    if (e.data === "msg 0") {
      es.close();
    }
    console.log("stream"+i+" received:", e.data);
    const li = document.createElement("li");
    li.textContent = e.data;
    msgContainer.appendChild(li);
  };
}

document.addEventListener("DOMContentLoaded", () => {
  startStream("1");
  startStream("2");
});
