package com.supplystock.dto;

import java.math.BigDecimal;

public class SupplierDTO {
    private Long id;
    private String name;
    private String code;
    private String contactPerson;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String country;
    private BigDecimal reliabilityScore;
    private BigDecimal onTimeDeliveryRate;
    private BigDecimal qualityRating;
    private Integer totalOrdersCompleted;
    private String paymentTerms;
    private Boolean isActive;

    public SupplierDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getContactPerson() { return contactPerson; }
    public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public BigDecimal getReliabilityScore() { return reliabilityScore; }
    public void setReliabilityScore(BigDecimal reliabilityScore) { this.reliabilityScore = reliabilityScore; }
    public BigDecimal getOnTimeDeliveryRate() { return onTimeDeliveryRate; }
    public void setOnTimeDeliveryRate(BigDecimal onTimeDeliveryRate) { this.onTimeDeliveryRate = onTimeDeliveryRate; }
    public BigDecimal getQualityRating() { return qualityRating; }
    public void setQualityRating(BigDecimal qualityRating) { this.qualityRating = qualityRating; }
    public Integer getTotalOrdersCompleted() { return totalOrdersCompleted; }
    public void setTotalOrdersCompleted(Integer totalOrdersCompleted) { this.totalOrdersCompleted = totalOrdersCompleted; }
    public String getPaymentTerms() { return paymentTerms; }
    public void setPaymentTerms(String paymentTerms) { this.paymentTerms = paymentTerms; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
