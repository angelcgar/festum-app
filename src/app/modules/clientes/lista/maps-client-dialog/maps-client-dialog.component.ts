import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

export interface CapturedAddress {
	fullAddress: string;
	street: string;
	number: string;
	neighborhood: string;
	city: string;
	state: string;
	country: string;
	postalCode: string;
	lat: number;
	lng: number;
}

/**
 * 🗺️ Componente Modal para Capturar Dirección desde Google Maps
 */
@Component({
	selector: 'app-maps-client-dialog',
	standalone: true,
	imports: [
		CommonModule,
		MatDialogModule,
		MatButtonModule,
		MatIconModule,
	],
	templateUrl: './maps-client-dialog.component.html',
	styleUrl: './maps-client-dialog.component.scss',
})
export class MapsClientDialogComponent implements OnInit {
	@ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

	private map!: google.maps.Map;
	private marker: google.maps.Marker | null = null;
	private geocoder!: google.maps.Geocoder;
	
	pinColocado = false;
	capturando = false;

	public dialogRef = inject(MatDialogRef<MapsClientDialogComponent>);

	ngOnInit(): void {
		this.initMap();
	}

	/**
	 * 🗺️ Inicializar Google Maps
	 */
	private initMap(): void {
		// Coordenadas por defecto (Guadalajara, México)
		const defaultLocation = { lat: 20.6736, lng: -103.3744 };

		this.map = new google.maps.Map(this.mapContainer.nativeElement, {
			center: defaultLocation,
			zoom: 13,
			mapTypeControl: true,
			streetViewControl: false,
			fullscreenControl: true,
		});

		this.geocoder = new google.maps.Geocoder();

		// Listener para clicks en el mapa
		this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
			this.colocarPin(event.latLng!);
		});
	}

	/**
	 * 📍 Colocar o mover el pin en el mapa
	 */
	private colocarPin(location: google.maps.LatLng): void {
		// Si ya existe un marker, removerlo
		if (this.marker) {
			this.marker.setMap(null);
		}

		// Crear nuevo marker
		this.marker = new google.maps.Marker({
			position: location,
			map: this.map,
			animation: google.maps.Animation.DROP,
			draggable: true,
		});

		// Listener para cuando el usuario arrastra el pin
		this.marker.addListener('dragend', () => {
			// El pin sigue colocado después de arrastrarlo
			this.pinColocado = true;
		});

		this.pinColocado = true;
	}

	/**
	 * 📍 Capturar dirección del pin
	 */
	async capturarDireccion(): Promise<void> {
		if (!this.marker) {
			return;
		}

		this.capturando = true;

		try {
			const position = this.marker.getPosition();
			if (!position) {
				throw new Error('No se pudo obtener la posición del pin');
			}

			const lat = position.lat();
			const lng = position.lng();

			// Reverse geocoding
			const response = await this.geocoder.geocode({ location: { lat, lng } });

			if (response.results && response.results.length > 0) {
				const result = response.results[0];
				
				console.log('📍 Resultado de Geocoding:', result);

				// Parsear los componentes de la dirección
				const address = this.parseAddressComponents(result.address_components, lat, lng);
				
				console.log('📍 Dirección parseada:', address);

				// Cerrar el diálogo y retornar la dirección
				this.dialogRef.close(address);
			} else {
				console.error('No se encontraron resultados de geocoding');
				this.capturando = false;
			}
		} catch (error) {
			console.error('Error al capturar dirección:', error);
			this.capturando = false;
		}
	}

	/**
	 * 🔍 Parsear componentes de dirección de Google Maps
	 */
	private parseAddressComponents(
		components: google.maps.GeocoderAddressComponent[],
		lat: number,
		lng: number
	): CapturedAddress {
		const address: CapturedAddress = {
			fullAddress: '',
			street: '',
			number: '',
			neighborhood: '',
			city: '',
			state: '',
			country: '',
			postalCode: '',
			lat,
			lng,
		};

		// Mapear componentes de Google Maps a nuestro formato
		for (const component of components) {
			const types = component.types;

			if (types.includes('street_number')) {
				address.number = component.long_name;
			}
			if (types.includes('route')) {
				address.street = component.long_name;
			}
			if (types.includes('sublocality') || types.includes('neighborhood')) {
				address.neighborhood = component.long_name;
			}
			if (types.includes('locality')) {
				address.city = component.long_name;
			}
			if (types.includes('administrative_area_level_1')) {
				address.state = component.long_name;
			}
			if (types.includes('country')) {
				address.country = component.long_name;
			}
			if (types.includes('postal_code')) {
				address.postalCode = component.long_name;
			}
		}

		// Construir dirección completa
		const parts: string[] = [];
		if (address.street) parts.push(address.street);
		if (address.number) parts.push(address.number);
		if (address.neighborhood) parts.push(`Col. ${address.neighborhood}`);
		if (address.city) parts.push(address.city);
		if (address.state) parts.push(address.state);
		if (address.postalCode) parts.push(address.postalCode);
		if (address.country) parts.push(address.country);

		address.fullAddress = parts.join(', ');

		return address;
	}

	/**
	 * ❌ Cancelar y cerrar diálogo
	 */
	cancelar(): void {
		this.dialogRef.close();
	}
}
