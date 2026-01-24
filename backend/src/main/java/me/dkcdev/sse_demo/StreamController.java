package me.dkcdev.sse_demo;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.Duration;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import reactor.core.publisher.Flux;

@RestController
public class StreamController {

    @GetMapping("/stream1")
    public void stream1(HttpServletRequest req, HttpServletResponse res) throws IOException, InterruptedException {

        res.setContentType("text/event-stream");
        res.setCharacterEncoding("UTF-8");

        PrintWriter writer = res.getWriter();

        for (int i = 10; i >= 0; i--) {
            writer.write("data: msg " + i + "\n\n");
            writer.flush();
            Thread.sleep(1000);
        }

        writer.close();
    }

    @GetMapping(value = "/stream2", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream2() {

        SseEmitter emitter = new SseEmitter();

        new Thread(() -> {
            try {
                for (int i = 10; i >= 0; i--) {
                    emitter.send("msg " + i);
                    Thread.sleep(1000);
                }
                emitter.complete();
            } catch (Exception e) {
                emitter.completeWithError(e);
            }
        }).start();

        return emitter;
    }

    @GetMapping("/stream3")
    public Flux<String> stream3() {
        return Flux.interval(Duration.ofSeconds(1))
                .take(11)
                .map(i -> "msg " + (10 - i));
    }

}
