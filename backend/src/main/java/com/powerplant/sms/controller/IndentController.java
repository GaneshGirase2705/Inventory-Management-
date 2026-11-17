package com.powerplant.sms.controller;

import com.powerplant.sms.dto.IndentRequest;
import com.powerplant.sms.model.Indent;
import com.powerplant.sms.model.IndentItem;
import com.powerplant.sms.model.Item;
import com.powerplant.sms.model.User;
import com.powerplant.sms.model.enums.IndentStatus;
import com.powerplant.sms.model.enums.IndentType;
import com.powerplant.sms.model.enums.UserRole;
import com.powerplant.sms.repository.IndentRepository;
import com.powerplant.sms.repository.ItemRepository;
import com.powerplant.sms.service.AuthService;
import com.powerplant.sms.service.StockTransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/v1/indents")
@CrossOrigin(origins = "*")
public class IndentController {

    private final IndentRepository indentRepository;
    private final ItemRepository itemRepository;
    private final AuthService authService;
    private final StockTransactionService stockTransactionService;

    public IndentController(IndentRepository indentRepository,
                            ItemRepository itemRepository,
                            AuthService authService,
                            StockTransactionService stockTransactionService) {
        this.indentRepository = indentRepository;
        this.itemRepository = itemRepository;
        this.authService = authService;
        this.stockTransactionService = stockTransactionService;
    }

    @GetMapping
    public ResponseEntity<List<Indent>> getIndents(@RequestParam(required = false) String status) {
        if (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("ALL")) {
            try {
                return ResponseEntity.ok(indentRepository.findByStatus(IndentStatus.valueOf(status.toUpperCase())));
            } catch (Exception e) {
                return ResponseEntity.ok(indentRepository.findAll());
            }
        }
        return ResponseEntity.ok(indentRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Indent> createIndent(@RequestBody IndentRequest request) {
        User currentUser = authService.getCurrentUser();

        Indent indent = new Indent();
        indent.setIndentNumber("IND-" + System.currentTimeMillis());
        indent.setDepartment(request.getDepartment());
        indent.setPlantUnit(request.getPlantUnit());
        indent.setWorkOrderNumber(request.getWorkOrderNumber());
        indent.setIndentType(request.getIndentType() != null ? request.getIndentType() : IndentType.REGULAR);
        indent.setPriority(request.getPriority() != null ? request.getPriority() : "NORMAL");
        indent.setRequestedBy(currentUser);
        indent.setStatus(IndentStatus.SUBMITTED);
        indent.setCurrentApproverRole(UserRole.HOD);

        // Emergency Breakdown Override logic
        if (request.isEmergencyOverride()) {
            indent.setIsEmergencyOverride(true);
            indent.setEmergencyJustification(request.getEmergencyJustification());
            indent.setStatus(IndentStatus.EMERGENCY_ISSUED);
            indent.setPostFactoDeadline(OffsetDateTime.now().plusHours(24));
        }

        List<IndentItem> items = new ArrayList<>();
        if (request.getItems() != null) {
            for (IndentRequest.IndentItemDto itemDto : request.getItems()) {
                Item item = itemRepository.findById(itemDto.getItemId()).orElse(null);
                if (item != null) {
                    IndentItem indentItem = new IndentItem();
                    indentItem.setIndent(indent);
                    indentItem.setItem(item);
                    indentItem.setRequestedQty(itemDto.getRequestedQty());
                    indentItem.setRemarks(itemDto.getRemarks());
                    items.add(indentItem);
                }
            }
        }
        indent.setItems(items);

        return ResponseEntity.ok(indentRepository.save(indent));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<Indent> approveIndent(@PathVariable UUID id, @RequestBody(required = false) Map<String, String> body) {
        User approver = authService.getCurrentUser();
        return indentRepository.findById(id).map(indent -> {
            indent.setStatus(IndentStatus.APPROVED);
            indent.setApprover(approver);
            if (body != null && body.containsKey("remarks")) {
                indent.setApproverRemarks(body.get("remarks"));
            }
            if (indent.getIsEmergencyOverride()) {
                indent.setPostFactoApproved(true);
                indent.setPostFactoApprovedBy(approver);
                indent.setPostFactoApprovalTime(OffsetDateTime.now());
            }
            return ResponseEntity.ok(indentRepository.save(indent));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<Indent> rejectIndent(@PathVariable UUID id, @RequestBody(required = false) Map<String, String> body) {
        User approver = authService.getCurrentUser();
        return indentRepository.findById(id).map(indent -> {
            indent.setStatus(IndentStatus.REJECTED);
            indent.setApprover(approver);
            if (body != null && body.containsKey("reason")) {
                indent.setApproverRemarks(body.get("reason"));
            }
            return ResponseEntity.ok(indentRepository.save(indent));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/emergency-issue")
    public ResponseEntity<Indent> emergencyIssue(@PathVariable UUID id) {
        return indentRepository.findById(id).map(indent -> {
            indent.setIsEmergencyOverride(true);
            indent.setStatus(IndentStatus.EMERGENCY_ISSUED);
            indent.setPostFactoDeadline(OffsetDateTime.now().plusHours(24));
            return ResponseEntity.ok(indentRepository.save(indent));
        }).orElse(ResponseEntity.notFound().build());
    }
}
