package dbc.dto;

import dbc.model.Associados;
import dbc.model.Pautas;

public class Sessao {
	
	private Pautas pauta;
	
	private Associados associado;
	
	private int voto;

	public Sessao(Pautas pauta, Associados associado, int voto) {
		this.pauta = pauta;
		this.associado = associado;
		this.voto = voto;
	}

	public Pautas getPauta() {
		return pauta;
	}

	public void setPauta(Pautas pauta) {
		this.pauta = pauta;
	}

	public Associados getAssociado() {
		return associado;
	}

	public void setAssociado(Associados associado) {
		this.associado = associado;
	}

	public int getVoto() {
		return voto;
	}

	public void setVoto(int voto) {
		this.voto = voto;
	}

	
}