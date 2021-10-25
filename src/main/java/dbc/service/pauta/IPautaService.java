package dbc.service.pauta;

import java.util.List;

import dbc.model.Pautas;

public interface IPautaService {
	
	List<Pautas> findAll() throws Exception;
	
	Pautas savePauta(Pautas pauta) throws Exception;
	
	Pautas findPautasByIdAndSessao(Long id) throws Exception;
	
	Pautas encerraSessao(Pautas pauta) throws Exception;
}