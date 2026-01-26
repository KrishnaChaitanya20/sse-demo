package me.dkcdev.sse_demo.models;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.codec.ServerSentEvent;

import lombok.Data;
import reactor.core.publisher.Sinks;

@Data
public class ChatRoom {

    private final String chatId;

    // logical members, not connections
    private final Set<String> users = ConcurrentHashMap.newKeySet();

    // this replaces List<SseEmitter>
    private final Sinks.Many<ServerSentEvent<ChatMsg>> sink =
            Sinks.many().multicast().onBackpressureBuffer();
}
