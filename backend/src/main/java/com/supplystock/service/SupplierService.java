package com.supplystock.service;

import com.supplystock.dto.SupplierDTO;
import com.supplystock.entity.Supplier;
import com.supplystock.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    public List<SupplierDTO> getAllSuppliers() {
        return supplierRepository.findByOrderByReliabilityScoreDesc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public SupplierDTO getSupplierById(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Supplier not found with id: " + id));
        return toDTO(supplier);
    }

    @Transactional
    public SupplierDTO createSupplier(SupplierDTO dto) {
        Supplier supplier = new Supplier();
        supplier.setName(dto.getName());
        supplier.setCode(dto.getCode());
        supplier.setContactPerson(dto.getContactPerson());
        supplier.setEmail(dto.getEmail());
        supplier.setPhone(dto.getPhone());
        supplier.setAddress(dto.getAddress());
        supplier.setCity(dto.getCity());
        supplier.setCountry(dto.getCountry() != null ? dto.getCountry() : "USA");
        supplier.setPaymentTerms(dto.getPaymentTerms() != null ? dto.getPaymentTerms() : "Net 30");
        supplier.setReliabilityScore(dto.getReliabilityScore() != null ? dto.getReliabilityScore() : BigDecimal.valueOf(85.0));
        supplier.setOnTimeDeliveryRate(dto.getOnTimeDeliveryRate() != null ? dto.getOnTimeDeliveryRate() : BigDecimal.valueOf(90.0));
        supplier.setQualityRating(dto.getQualityRating() != null ? dto.getQualityRating() : BigDecimal.valueOf(4.5));
        supplier.setTotalOrdersCompleted(0);
        supplier.setIsActive(true);

        return toDTO(supplierRepository.save(supplier));
    }

    @Transactional
    public SupplierDTO updateSupplier(Long id, SupplierDTO dto) {
        Supplier s = supplierRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Supplier not found with id: " + id));

        if (dto.getName() != null) s.setName(dto.getName());
        if (dto.getContactPerson() != null) s.setContactPerson(dto.getContactPerson());
        if (dto.getEmail() != null) s.setEmail(dto.getEmail());
        if (dto.getPhone() != null) s.setPhone(dto.getPhone());
        if (dto.getAddress() != null) s.setAddress(dto.getAddress());
        if (dto.getCity() != null) s.setCity(dto.getCity());
        if (dto.getPaymentTerms() != null) s.setPaymentTerms(dto.getPaymentTerms());
        if (dto.getReliabilityScore() != null) s.setReliabilityScore(dto.getReliabilityScore());
        if (dto.getOnTimeDeliveryRate() != null) s.setOnTimeDeliveryRate(dto.getOnTimeDeliveryRate());

        return toDTO(supplierRepository.save(s));
    }

    public SupplierDTO toDTO(Supplier s) {
        SupplierDTO dto = new SupplierDTO();
        dto.setId(s.getId());
        dto.setName(s.getName());
        dto.setCode(s.getCode());
        dto.setContactPerson(s.getContactPerson());
        dto.setEmail(s.getEmail());
        dto.setPhone(s.getPhone());
        dto.setAddress(s.getAddress());
        dto.setCity(s.getCity());
        dto.setCountry(s.getCountry());
        dto.setReliabilityScore(s.getReliabilityScore());
        dto.setOnTimeDeliveryRate(s.getOnTimeDeliveryRate());
        dto.setQualityRating(s.getQualityRating());
        dto.setTotalOrdersCompleted(s.getTotalOrdersCompleted());
        dto.setPaymentTerms(s.getPaymentTerms());
        dto.setIsActive(s.getIsActive());
        return dto;
    }
}
