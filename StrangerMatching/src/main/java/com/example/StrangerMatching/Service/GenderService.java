package com.example.StrangerMatching.Service;

import com.example.StrangerMatching.Entity.GenderEntity;
import com.example.StrangerMatching.Repository.IGenderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GenderService {
    @Autowired
    private IGenderRepository iGenderRepository;

    public List<GenderEntity> getAll(){
        return iGenderRepository.findAll();
    }
}
