import React, { useState, useEffect, FormEvent } from 'react';
import { Link, useHistory }	from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import axios from 'axios';

import api from '../../services/api';

import Dropzone from '../../components/Dropzone';

import './styles.css';
import logo from '../../assets/logo.svg';

interface RecyclableItem {
	id: number,
	title: string,
	image_url: string
}

interface State {
	id: number,
	sigla: string,
	nome: string,
	regiao: {
		id: number,
		sigla: string,
		nome: string
	}
}

interface City {
	id: number,
	nome: string,
	mesorregiao: {
		id: number,
		nome: string,
		UF: {
			id: number,
			sigla: string,
			nome: string,
			regiao: {
				id: number,
				sigla: string,
				nome: string
			}
		}
	}
}

const CreatePoint: React.FC = () => {
	const history = useHistory();

	const [recyclabeItems, setRecyclableItems] = useState<RecyclableItem[]>([]);
	const [states, setStates] = useState<State[]>([]);
	const [citys, setCitys] = useState<City[]>([]);

	const [selectedUF, setSelectedUF] = useState('0');
	const [selectedCity, setSelectedCity] = useState('0');
	const [selectedRecyclables, setSelectedRecyclables] = useState<number[]>([]);
	const [selectedFile, setSelectedFile] = useState<File>();
	const [userInitialPosition, setUserInitialPosition] = useState<[number, number]>();
	const [mapPosition, setMapPosition] = useState<[number, number]>([0, 0]);

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [whatsapp, setWhatsapp] = useState('');

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(position => {
			const { latitude, longitude } = position.coords;

			setUserInitialPosition([latitude, longitude]);
		}, () => {
			setUserInitialPosition([0, 0]);
		}, {
			enableHighAccuracy: true
		});
	}, []);

	useEffect(() => {
		async function loadRecyclablesItems() {
			const response = await api.get<RecyclableItem[]>('items');

			setRecyclableItems(response.data);
		}

		loadRecyclablesItems();
	}, []);

	useEffect(() => {
		async function loadStates() {
			const response = await axios.get<State[]>(
				'localidades/estados', {
				baseURL: 'https://servicodados.ibge.gov.br/api/v1',
				params: {
					orderBy: 'nome'
				}
			});

			setStates(response.data);
		}

		loadStates();
	}, []);

	useEffect(() => {
		async function loadCitys() {
			if (selectedUF === '0') return;

			const response = await axios.get<City[]>(
				`localidades/estados/${selectedUF}/microrregioes`, {
				baseURL: 'https://servicodados.ibge.gov.br/api/v1',
				params: {
					orderBy: 'nome'
				}
			});

			setCitys(response.data);
		}

		loadCitys();
	}, [selectedUF]);

	function handleSelectRecyclable(id: number) {
		setSelectedRecyclables(oldSelectedRecyclables => {
			const alredySelected = oldSelectedRecyclables.findIndex(recyclable => recyclable === id);

			if (alredySelected >= 0)
				return oldSelectedRecyclables.filter(recyclabe => recyclabe !== id);
			
			return [...oldSelectedRecyclables, id];
		});
	}

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();

		const [latitude, longitude] = mapPosition;

		const data = new FormData();

		data.append('name', name);
		data.append('email', email);
		data.append('whatsapp', whatsapp);
		data.append('uf', selectedUF);
		data.append('city', selectedCity);
		data.append('latitude', String(latitude));
		data.append('longitude', String(longitude));
		data.append('items', selectedRecyclables.join(','));

		if (selectedFile)
			data.append('image', selectedFile);

		await api.post('collect', data);

		history.push('/registration-succeeded');
	}

	return (
		<div id="page-create-point">
			<header>
				<img src={logo} alt="Ecoleta" />

				<Link to="/">
					<FiArrowLeft />
					Voltar para home
				</Link>
			</header>

			<form onSubmit={handleSubmit}>
				<h1>Cadastro do ponto de coleta</h1>

				<Dropzone onFileChange={(file) => setSelectedFile(file[0])} />

				<fieldset>
					<legend>
						<h2>Dados</h2>
					</legend>

					<div className="field">
						<label htmlFor="name">Nome da entidade</label>
						<input
							type="text"
							name="name"
							id="name"
							onChange={event => setName(event.target.value)}
							value={name}
						/>
					</div>

					<div className="field-group">
						<div className="field">
							<label htmlFor="email">E-mail</label>
							<input
								type="email"
								name="email"
								id="email"
								onChange={event => setEmail(event.target.value)}
								value={email}
							/>
						</div>

						<div className="field">
							<label htmlFor="whatsapp">Whatsapp</label>
							<input
								type="text"
								name="whatsapp"
								id="whatsapp"
								onChange={event => setWhatsapp(event.target.value)}
								value={whatsapp}
							/>
						</div>
					</div>
				</fieldset>

				<fieldset>
					<legend>
						<h2>Endereço</h2>
						<span>Selecione o endereço no mapa</span>
					</legend>

					<Map
						center={userInitialPosition}
						zoom={15}
						onclick={event => setMapPosition([event.latlng.lat, event.latlng.lng])}
					>
						<TileLayer
							attribution="copy <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>
						<Marker position={mapPosition} />
					</Map>

					<div className="field-group">
						<div className="field">
							<label htmlFor="uf">Estado (UF)</label>
							<select
								name="uf"
								id="uf"
								onChange={event => setSelectedUF(event.target.value)}
								value={selectedUF}
							>
								<option value="0">Selecione uma UF</option>
								{states.map(state => (
									<option key={state.id} value={state.sigla}>{state.nome}</option>
								))}
							</select>
						</div>

						<div className="field">
							<label htmlFor="city">Cidade</label>
							<select
								name="city"
								id="city"
								onChange={event => setSelectedCity(event.target.value)}
								value={selectedCity}
							>
								<option value="0">Selecione uma cidade</option>
								{citys.map(city => (
									<option key={city.id} value={city.nome}>{city.nome}</option>
								))}
							</select>
						</div>
					</div>
				</fieldset>

				<fieldset>
					<legend>
						<h2>Ítens de coleta</h2>
						<span>Selecione um ou mais items abaixo</span>
					</legend>
				</fieldset>

				<ul className="items-grid">
					{recyclabeItems.map(item => (
						<li
							key={item.id}
							onClick={() => handleSelectRecyclable(item.id)}
							className={selectedRecyclables.includes(item.id) ? 'selected' : ''}
						>
							<img src={item.image_url} alt={item.title} />
							<span>{item.title}</span>
						</li>
					))}
				</ul>

				<button type="submit">Cadastrar ponto de coleta</button>
			</form>
		</div>
	);
}

export default CreatePoint;
