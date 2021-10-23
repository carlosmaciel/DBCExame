package dbc.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "votacoes")
public class Votacoes {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="ID_PAUTA", nullable=false)
	private Pautas pauta;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="ID_ASSOCIADO", nullable=false)
	private Associados associado;
	
	@Column(name="voto", nullable=false)
	private int voto;
	
	public Votacoes() {}

	public Votacoes(Pautas pauta, Associados associado, int voto) {
		this.pauta = pauta;
		this.associado = associado;
		this.voto = voto;
	}
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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