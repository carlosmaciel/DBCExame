package dbc.service.votacao;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dbc.dto.Resultados;
import dbc.dto.ValidacaoCPF;
import dbc.exception.VotacaoException;
import dbc.model.Associados;
import dbc.model.Pautas;
import dbc.model.Votacoes;
import dbc.repository.VotacaoRepository;
import dbc.webservice.RestService;

@Service
public class VotacaoService implements IVotacaoService {

	@Autowired
	private VotacaoRepository votacaoRepository;

	@Override
	public Votacoes votar(Pautas pauta, Associados associado, int voto) throws Exception{
				
		Votacoes verificaVoto = verificaVotoAssociado(pauta, associado);
				
		if(verificaVoto != null)
			throw new VotacaoException("Associado já votou nesta pauta!");
		
		Votacoes votacao = new Votacoes(pauta, associado, voto);
		
		return votacaoRepository.saveAndFlush(votacao);
	}

	private Votacoes verificaVotoAssociado(Pautas pauta, Associados associado) throws Exception{
		return votacaoRepository.findByPautaAndAssociado(pauta, associado);
	}

	@Override
	public Resultados informarResultado(Long idPauta) throws Exception {
		
		Map<String, Object> map = votacaoRepository.informarResultado(idPauta);
		
		if(map == null)
			throw new VotacaoException ("Nenhuma pauta foi encontrada.");
		
		Resultados resultado = new Resultados();
		resultado.setIdPauta(Long.parseLong(map.get("idPauta").toString()));
		resultado.setSim(Integer.parseInt(map.get("sim").toString()));
		resultado.setNao(Integer.parseInt(map.get("nao").toString()));
		
		return resultado;
	}
	
	public ValidacaoCPF validarCPF(String cpf) throws Exception {
		RestService rest = new RestService();
		return rest.consumir(cpf);
	}

}