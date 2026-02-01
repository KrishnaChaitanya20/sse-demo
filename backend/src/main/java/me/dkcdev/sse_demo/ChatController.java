package me.dkcdev.sse_demo;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import me.dkcdev.sse_demo.models.ChatMsg;
import me.dkcdev.sse_demo.models.ChatRoom;
import reactor.core.publisher.Flux;

@RestController
public class ChatController {

	private final Map<String, ChatRoom> chatRooms = new ConcurrentHashMap<>();

	@GetMapping(value = "/chat/{chatId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	public Flux<ServerSentEvent<ChatMsg>> chat(
			@PathVariable String chatId,
			@RequestParam String userId) {

		System.out.println("User " + userId + " connected to chat " + chatId);
		// create chat room if not present
		ChatRoom room = chatRooms.computeIfAbsent(
				chatId,
				id -> new ChatRoom(id));

		if (!room.getUsers().contains(userId)) {
			room.getUsers().add(userId);
		}

		room.getSink().tryEmitNext(
				ServerSentEvent.<ChatMsg>builder()
						.event("message")
						.data(new ChatMsg("System", userId + " joined the chat"))
						.build());

		return room.getSink()
				.asFlux()
				.doOnCancel(() -> {
					room.getUsers().remove(userId);
					System.out.println("User " + userId + " disconnected from chat " + chatId);
				});
	}

	/**
	 * Send a message to all subscribers
	 */
	@PostMapping("/msg/{chatId}")
	public void sendMessage(
			@PathVariable String chatId,
			@RequestBody ChatMsg msg) {

		ChatRoom room = chatRooms.get(chatId);
		if (room == null)
			return;
		if (!room.getUsers().contains(msg.getUserId()))
			return;
		room.getSink().tryEmitNext(
				ServerSentEvent.<ChatMsg>builder()
						.event("message")
						.data(msg)
						.build());
	}

	@PostMapping("/leave/{chatId}")
	public ResponseEntity<Void> leaveChat(
			@PathVariable String chatId,
			@RequestBody Map<String, String> body) {
		
		String userId = body.get("userId");
		System.out.println("Request to leave chat " + chatId + " by user " + userId);
		ChatRoom room = chatRooms.get(chatId);
		if (room == null)
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		
		if (!room.getUsers().contains(userId))
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		
		room.getUsers().remove(userId);
		System.out.println("User " + userId + " disconnected from chat " + chatId);
		room.getSink().tryEmitNext(
				ServerSentEvent.<ChatMsg>builder()
						.event("message")
						.data(new ChatMsg("System", userId + " left the chat"))
						.build());
		
		return ResponseEntity.noContent().build();
	}

}
