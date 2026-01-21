package me.dkcdev.sse_demo;

import java.io.IOException;
import java.io.PrintWriter;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

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



}
