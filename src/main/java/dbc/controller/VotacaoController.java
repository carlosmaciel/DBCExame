package dbc.controller;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import dbc.dto.Resultados;
import dbc.dto.Sessao;
import dbc.dto.ValidacaoCPF;
import dbc.exception.VotacaoException;
import dbc.model.Votacoes;
import dbc.service.votacao.IVotacaoService;

@Controller
@RequestMapping("/dbc/votacoes")
public class VotacaoController {

	@Autowired
	private IVotacaoService votacaoService;
	
	private Logger logger = Logger.getLogger(VotacaoController.class);

	@InitBinder
	public void initBinder(WebDataBinder binder) {
		SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
		binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, false));
	}
	
	@RequestMapping(value = "/", method = RequestMethod.POST)
    public ResponseEntity<?> votar(@RequestBody Sessao sessao) {
		try {
			Votacoes votacao = null;
			
			if(sessao != null) {
				/*if(sessao.getAssociado() != null && sessao.getAssociado().getCpf() != null) {
					ValidacaoCPF valida = votacaoService.validarCPF(sessao.getAssociado().getCpf());
					if(valida.getStatus().equalsIgnoreCase("UNABLE_TO_VOTE"))
						throw new VotacaoException ("O associado não está apto para votar.");  
				} else
					throw new VotacaoException ("Um associado deve ser escolhido para votar."); */
				
				logger.info("Registrando voto.");
				votacao = votacaoService.votar(sessao.getPauta(), sessao.getAssociado(), sessao.getVoto());
				logger.info("Voto registrado.");
			} else {
				logger.error("Erro ao processar voto: variável da Sessao está nula!");
				throw new VotacaoException ("Erro ao processar voto: variável da Sessao está nula!");
			}
			
			return ResponseEntity.ok(votacao);
			
		} catch (VotacaoException v) {
			logger.info(v.getMessage());
			return ResponseEntity.status(HttpStatus.CONFLICT).body(v.getMessage());
		} catch (Exception e) {
			logger.error("Erro ao registrar voto: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}        
    }
	
	@RequestMapping(value = "/informarResultado/{idPauta}", method = RequestMethod.GET)
	public ResponseEntity<?> informarResultado(@PathVariable("idPauta") Long idPauta) {		
		try {
			logger.info("Informando resultado.");
			Resultados resultado = votacaoService.informarResultado(idPauta);
			logger.info("Sim: " + resultado.getSim() + " votos. Nao: " + resultado.getNao() + " votos.");
			return ResponseEntity.ok(resultado);
		} catch (Exception e) {
			logger.error("Erro ao informar resultado: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}
	
	@RequestMapping(value = "/checarCPF/{cpf}", method = RequestMethod.GET)
	public ResponseEntity<?> checarCPF(@PathVariable("cpf") String cpf) {		
		try {
			logger.info("Validando CPF " + cpf);
			ValidacaoCPF valida = votacaoService.validarCPF(cpf);
			logger.info("CPF validado: " + valida.getStatus());
			return ResponseEntity.ok(valida);
		} catch (Exception e) {
			logger.error("Erro ao validar CPF: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}
}
