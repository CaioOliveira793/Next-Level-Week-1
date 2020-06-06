import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, Image, Text, SafeAreaView, Linking } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import * as MailComposer from 'expo-mail-composer';
import api from '../../services/api';

import styles from './styles';

interface RouteParams {
	point_id: number;
}

interface PointDetails {
	point: {
		id: number,
		image: string,
		name: string,
		email: string,
		whatsapp: string,
		city: string,
		uf: string
	},
	items: {
		title: string
	}[]
}


const Detail: React.FC = () => {
	const [pointDetails, setPointDetails] = useState<PointDetails>({} as PointDetails);
	const navigation = useNavigation();
	const route = useRoute();

	const routeParams = route.params as RouteParams;

	useEffect(() => {
		async function loadPointDetails() {
			const response = await api.get<PointDetails>(`collect/${routeParams.point_id}`);

			setPointDetails(response.data);
		}

		loadPointDetails();
	}, [routeParams]);

	const handleNavigateBack = useCallback(() => {
		navigation.goBack();
	}, []);

	const handleWhatsapp = useCallback(() => {
		Linking.openURL(`whatsapp://send?phone=${pointDetails.point.whatsapp}&text=Tenho interesse sobre a coleta de resíduos`);
	}, [pointDetails]);

	const handleComposeMail = useCallback(() => {
		MailComposer.composeAsync({
			subject: 'Interesse na coleta de resíduos',
			recipients: [pointDetails.point.email]
		});
	}, [pointDetails]);


	if (!pointDetails.point) {
		return null;
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={styles.container}>
				<TouchableOpacity onPress={handleNavigateBack}>
					<Feather name="arrow-left" color="#34cb79" size={20} />
				</TouchableOpacity>

				<Image style={styles.pointImage} source={{ uri: pointDetails.point.image }} />

				<Text style={styles.pointName}>{pointDetails.point.name}</Text>
				<Text style={styles.pointItems}>
					{pointDetails.items.map(item => item.title).join(', ')}
				</Text>

				<View style={styles.address}>
					<Text style={styles.addressTitle}>Endereço</Text>
					<Text style={styles.addressContent}>{pointDetails.point.city}, {pointDetails.point.uf}</Text>
				</View>
			</View>
			<View style={styles.footer}>
				<RectButton style={styles.button} onPress={handleWhatsapp}>
					<FontAwesome name="whatsapp" size={24} color="#fff" />
					<Text style={styles.buttonText}>Whatsapp</Text>
				</RectButton>

				<RectButton style={styles.button} onPress={handleComposeMail}>
					<Feather name="mail" size={24} color="#fff" />
					<Text style={styles.buttonText}>E-mail</Text>
				</RectButton>
			</View>
		</SafeAreaView>
	)
}

export default Detail;
