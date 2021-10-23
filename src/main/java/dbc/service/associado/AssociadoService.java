package dbc.service.associado;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dbc.model.Associados;
import dbc.repository.AssociadoRepository;

@Service
public class AssociadoService implements IAssociadoService {

	@Autowired
	private AssociadoRepository associadoRepository;

	@Override
	public List<Associados> findAll() throws Exception {
		return associadoRepository.findAll();
	}

	@Override
	public Associados saveAssociado(Associados associado) throws Exception {
		return associadoRepository.saveAndFlush(associado);	
	}

}