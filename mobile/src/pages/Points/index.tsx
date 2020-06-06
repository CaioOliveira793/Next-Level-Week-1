import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, Text, ScrollView, Image, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Feather } from '@expo/vector-icons';
import { SvgUri } from 'react-native-svg';
import api from '../../services/api';

import styles from './styles';

interface RouteParams {
	uf: string,
	city: string
}

interface Items {
	id: number,
	title: string,
	image_url: string
}

interface CollectPoints {
	id: number,
	name: string,
	image: string
	latitude: number,
	longitude: number,
}


const Points: React.FC = () => {
	const navigation = useNavigation();
	const route = useRoute();

	const routeParams = route.params as RouteParams;

	const [items, setItems] = useState<Items[]>([]);
	const [collectPoints, setCollectPoints] = useState<CollectPoints[]>([]);
	const [selectedItems, setSelectedItems] = useState<number[]>([]);

	const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

	useEffect(() => {
		async function loadItems() {
			const response = await api.get<Items[]>('items');

			setItems(response.data);
		}

		loadItems();
	}, []);

	useEffect(() => {
		async function loadPosition() {
			const { status } = await Location.requestPermissionsAsync();

			if (status !== 'granted') {
				Alert.alert('Oooops...', 'Precisamos de sua permissão para obter a sua localização');
				return;
			}

			const location = await Location.getCurrentPositionAsync();

			const { latitude, longitude } = location.coords;

			setInitialPosition([latitude, longitude]);
		}

		loadPosition();
	}, []);

	useEffect(() => {
		async function loadCollectPoints() {
			const response = await api.get<CollectPoints[]>('collect', {
				params: {
					city: routeParams.city,
					uf: routeParams.uf,
					items: selectedItems
				}
			});

			setCollectPoints(response.data);
		}

		loadCollectPoints();
	}, [routeParams, selectedItems]);

	const handleNavigateBack = useCallback(() => {
		navigation.goBack();
	}, []);

	const handleNavigateToDetails = useCallback((collectPointId: number) => {
		navigation.navigate('Detail', { point_id: collectPointId });
	}, []);

	const handleSelectItem = useCallback((id: number) => {
		setSelectedItems(oldSelectedItems => {
			const alredySelected = oldSelectedItems.findIndex(item => item === id);

			if (alredySelected >= 0)
				return oldSelectedItems.filter(item => item !== id);
			
			return [...oldSelectedItems, id];
		});
	}, []);


	return (
		<>
			<View style={styles.container}>
				<TouchableOpacity onPress={handleNavigateBack}>
					<Feather name="arrow-left" color="#34cb79" size={20} />
				</TouchableOpacity>

				<Text style={styles.title}>Bem vindo</Text>
				<Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

				<View style={styles.mapContainer}>
					{initialPosition[0] !== 0 && (
						<MapView
							style={styles.map}
							loadingEnabled={initialPosition[0] === 0}
							initialRegion={{
								latitude: initialPosition[0],
								longitude: initialPosition[1],
								latitudeDelta: 0.014,
								longitudeDelta: 0.014
							}}
						>
							{collectPoints.map(point => (
								<Marker
									key={point.id}
									style={styles.mapMarker}
									onPress={() => handleNavigateToDetails(point.id)}
									coordinate={{
										latitude: point.latitude,
										longitude: point.longitude,
									}}
								>
									<View style={styles.mapMarkerContainer}>
										<Image style={styles.mapMarkerImage} source={{ uri: point.image }} />
										<Text style={styles.mapMarkerTitle}>{point.name}</Text>
									</View>
								</Marker>
							))}
						</MapView>
					)}
				</View>
			</View>
			<View style={styles.itemsContainer}>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{ paddingHorizontal: 20 }}
				>
					{items.map(item => (
						<TouchableOpacity
							key={String(item.id)}
							style={[
								styles.item,
								selectedItems.includes(item.id) ? styles.selectedItem : {}
							]}
							onPress={() => handleSelectItem(item.id)}
							activeOpacity={0.6}
						>
							<SvgUri width={42} height={42} uri={item.image_url} />
							<Text style={styles.itemTitle}>{item.title}</Text>
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>
		</>
	)
}

export default Points;
