package me.dkcdev.sse_demo.models;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChatMsg {
    String userId;
    String msg;
}
