package com.supplystock.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class AssistantDTO {

    public static class ChatRequest {
        @NotBlank(message = "Prompt cannot be empty")
        private String prompt;
        private String userRole = "RETAILER";

        public ChatRequest() {}
        public ChatRequest(String prompt, String userRole) {
            this.prompt = prompt;
            this.userRole = userRole;
        }

        public String getPrompt() { return prompt; }
        public void setPrompt(String prompt) { this.prompt = prompt; }
        public String getUserRole() { return userRole; }
        public void setUserRole(String userRole) { this.userRole = userRole; }
    }

    public static class ChatResponse {
        private String reply;
        private List<String> sourceAttribution;
        private String provider;

        public ChatResponse() {}
        public ChatResponse(String reply, List<String> sourceAttribution, String provider) {
            this.reply = reply;
            this.sourceAttribution = sourceAttribution;
            this.provider = provider;
        }

        public String getReply() { return reply; }
        public void setReply(String reply) { this.reply = reply; }
        public List<String> getSourceAttribution() { return sourceAttribution; }
        public void setSourceAttribution(List<String> sourceAttribution) { this.sourceAttribution = sourceAttribution; }
        public String getProvider() { return provider; }
        public void setProvider(String provider) { this.provider = provider; }
    }
}
