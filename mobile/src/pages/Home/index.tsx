import React, { useState, useEffect, useCallback } from 'react';
import { View, ImageBackground, Image, Text } from 'react-native';
import PickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';

import styles from './styles';

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

interface Options {
	label: string,
	value: string
}


const Home: React.FC = () => {
	const navigation = useNavigation();

	const [states, setStates] = useState<Options[]>([]);
	const [citys, setCitys] = useState<Options[]>([]);

	const [selectedUF, setSelectedUF] = useState('');
	const [selectedCity, setSelectedCity] = useState('');

	useEffect(() => {
		async function loadStates() {
			const response = await axios.get<State[]>(
				'localidades/estados', {
				baseURL: 'https://servicodados.ibge.gov.br/api/v1',
				params: {
					orderBy: 'nome'
				}
			});

			const stateOptions = response.data.map(state => ({
				label: state.nome,
				value: state.sigla
			}));

			setStates(stateOptions);
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

			const cityOptions = response.data.map(state => ({
				label: state.nome,
				value: state.nome
			}));

			setCitys(cityOptions);
		}

		loadCitys();
	}, [selectedUF]);

	const handleNavigateToPoints = useCallback(() => {
		navigation.navigate('Points', {
			uf: selectedUF,
			city: selectedCity
		});
	}, [selectedUF, selectedCity]);
	

	return (
		<ImageBackground
			source={require('../../assets/home-background.png')}
			style={styles.container}
			imageStyle={{ width: 274, height: 368 }}
		>
			<View style={styles.main}>
				<Image source={require('../../assets/logo.png')} />
				<Text style={styles.title}>
					Seu marketplace de coleta de resíduos
				</Text>
				<Text style={styles.description}>
					Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
				</Text>
			</View>

			<View>
				<PickerSelect
					placeholder={{ label: 'Selecione o estado', value: null }}
					items={states}
					onValueChange={(value) => setSelectedUF(value)}
				/>
				<PickerSelect
					placeholder={{ label: 'Selecione a cidade', value: null }}
					items={citys}
					onValueChange={(value) => setSelectedCity(value)}
				/>

				<RectButton style={styles.button} onPress={handleNavigateToPoints}>
					<View style={styles.buttonIcon}>
						<Feather name="arrow-right" color="#fff" size={24} />
					</View>
					<Text style={styles.buttonText}>Entrar</Text>
				</RectButton>
			</View>
		</ImageBackground>
	)
}

export default Home;
