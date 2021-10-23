package dbc.service.pauta;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dbc.model.Pautas;
import dbc.repository.PautaRepository;

@Service
public class PautaService implements IPautaService {

	@Autowired
	private PautaRepository pautaRepository;

	@Override
	public List<Pautas> findAll() throws Exception{
		return pautaRepository.findAll();
	}

	@Override
	public Pautas savePauta(Pautas pauta) throws Exception {
		return pautaRepository.saveAndFlush(pauta);
	}

}