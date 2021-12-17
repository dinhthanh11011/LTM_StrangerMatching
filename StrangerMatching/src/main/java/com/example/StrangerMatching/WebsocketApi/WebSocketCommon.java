package com.example.StrangerMatching.WebsocketApi;

public class WebSocketCommon {

    public static final String USER_ENTITY_KEY_IN_ONLINE_LIST = "userEntity";

    public static final String SIMPLE_BROKER = "/topic";
    public static final String ENDPOINT = "/ws";
    public static final String APP_DESTINATION_PREFIX = "/app";

    public static final String CHATTING_URL = SIMPLE_BROKER + "/Messages/";
    public static final String USER_ONLINE_URL = SIMPLE_BROKER + "/Online";

    public static final String STRANGER_MATCHING_URL = SIMPLE_BROKER + "/Match/";
    public static final String TOTAL_WAITING_STRANGER_MATCHING_URL = SIMPLE_BROKER + "/TotalWaitingMatching";
}
