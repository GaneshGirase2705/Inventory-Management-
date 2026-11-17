package com.powerplant.sms.repository;

import com.powerplant.sms.model.Indent;
import com.powerplant.sms.model.enums.Department;
import com.powerplant.sms.model.enums.IndentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface IndentRepository extends JpaRepository<Indent, UUID> {
    Optional<Indent> findByIndentNumber(String indentNumber);

    List<Indent> findByStatus(IndentStatus status);

    List<Indent> findByDepartment(Department department);

    List<Indent> findByIsEmergencyOverrideTrue();
}
