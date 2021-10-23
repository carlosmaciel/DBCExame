package dbc.service.associado;

import java.util.List;

import dbc.model.Associados;

public interface IAssociadoService {

	List<Associados> findAll() throws Exception;
	
	Associados saveAssociado(Associados associado) throws Exception;
}