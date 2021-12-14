package com.example.StrangerMatching.Configuration;

import com.example.StrangerMatching.CurrentData.UserMatchingStorage;
import com.example.StrangerMatching.DTO.UserDTO;
import com.example.StrangerMatching.WebsocketApi.WebSocketCommon;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.List;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfiguration implements WebSocketMessageBrokerConfigurer {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint(WebSocketCommon.ENDPOINT).setAllowedOriginPatterns("*").withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes(WebSocketCommon.APP_DESTINATION_PREFIX);
        registry.enableSimpleBroker(WebSocketCommon.SIMPLE_BROKER);
    }

    @EventListener
    public void onDisconnectEvent(SessionDisconnectEvent event) {
        UserMatchingStorage.getInstance().disconnectUserBySessionId(event.getSessionId());
        simpMessagingTemplate.convertAndSend(WebSocketCommon.USER_ONLINE_URL, UserMatchingStorage.getInstance().getListUserDTOOnline());
    }

}
