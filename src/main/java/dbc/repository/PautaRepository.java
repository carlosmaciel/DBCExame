package dbc.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import dbc.model.Pautas;

public interface PautaRepository extends JpaRepository<Pautas, Long>{
	
}
