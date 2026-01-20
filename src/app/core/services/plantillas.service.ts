import { Injectable, inject } from '@angular/core';
import { Observable, of, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { SalonesService } from './salones.service';
import type { PlanoTemplate } from '../models/salon.model';

/**
 * Interfaz de diseño guardado (tomada de plano.component.ts)
 * TODO: Centralizar en shared/types para evitar duplicación
 */
export interface DisenoGuardado {
	plantillaId: string;
	plantillaNombre: string;
	elementos: ElementoEnCanvas[];
	fechaGuardado: string;
	version: string;
}

/**
 * Elemento en canvas (estructura de plano.component.ts línea ~38)
 * TODO: Mover a shared/types cuando se refactorice
 */
export interface ElementoEnCanvas {
	id: string;
	tipo: string;
	nombre: string;
	posicion: { x: number; y: number };
	tamano: { ancho: number; alto: number };
	color: string;
	rotacion?: number;
	icono: string;
	productoServicioId?: number;
}

/**
 * Plantilla de evento con productos asociados
 */
export interface PlantillaEvento {
	id: string;
	nombre: string;
	descripcion: string;
	tipo: string;
	productosIds: number[];
	diseno: DisenoGuardado;
}

/**
 * Plantilla extendida que puede provenir de salones o plantillas custom
 */
// export interface PlantillaExtendida {
// 	id: string;
// 	nombre: string;
// 	descripcion?: string;
// 	tipo?: string;
// 	productosIds?: number[];
// 	diseno: DisenoGuardado | PlanoTemplate;
// 	origen: 'salon' | 'custom';
// }

@Injectable({
	providedIn: 'root',
})
export class PlantillasService {
	private salonesService = inject(SalonesService);
	/**
	 * Mock de plantillas de eventos
	 *
	 * NOTA: Las propiedades icono, color, tamano y productoServicioId se agregan para:
	 * 1. Compatibilidad con plano-view y su visualización de elementos
	 * 2. Mapeo directo entre productos del catálogo y elementos visuales del plano
	 * 3. Permitir la reconstrucción automática de productos desde la plantilla
	 *
	 * TODO: Estas plantillas deben obtenerse desde el backend cuando se implemente la API real.
	 * El servidor debe retornar las plantillas con sus elementos y referencias a productos.
	 */
	private mockPlantillas: PlantillaEvento[] = [
		{
			id: 'boda-clasica',
			nombre: 'Boda Clásica Elegante',
			descripcion: 'Configuración estándar para boda de 100 personas',
			tipo: 'Boda',
			productosIds: [3, 4, 5, 6], // Mesa Rectangular, Mesa Redonda, Sillas, Vajilla
			diseno: {
				plantillaId: 'boda-clasica',
				plantillaNombre: 'Boda Clásica Elegante',
				elementos: [
					{
						id: 'mesa-principal-1',
						tipo: 'mesa-rectangular',
						nombre: 'Mesa Rectangular Cristal 2.5x1.2m',
						posicion: { x: 250, y: 100 },
						tamano: { ancho: 180, alto: 90 },
						color: '#20b2aa',
						icono: 'table_bar',
						rotacion: 0,
						productoServicioId: 3,
					},
					{
						id: 'mesa-invitados-1',
						tipo: 'mesa-redonda',
						nombre: 'Mesa Redonda Madera Ø1.8m',
						posicion: { x: 150, y: 250 },
						tamano: { ancho: 120, alto: 120 },
						color: '#654321',
						icono: 'table_restaurant',
						rotacion: 0,
						productoServicioId: 4,
					},
					{
						id: 'mesa-invitados-2',
						tipo: 'mesa-redonda',
						nombre: 'Mesa Redonda Madera Ø1.8m',
						posicion: { x: 350, y: 250 },
						tamano: { ancho: 120, alto: 120 },
						color: '#654321',
						icono: 'table_restaurant',
						rotacion: 0,
						productoServicioId: 4,
					},
					{
						id: 'sillas-grupo-1',
						tipo: 'silla',
						nombre: 'Silla Chiavari Dorada',
						posicion: { x: 150, y: 400 },
						tamano: { ancho: 50, alto: 50 },
						color: '#ffd700',
						icono: 'event_seat',
						rotacion: 0,
						productoServicioId: 5,
					},
				],
				fechaGuardado: new Date().toISOString(),
				version: '1.0',
			},
		},
		{
			id: 'evento-corporativo',
			nombre: 'Evento Corporativo Formal',
			descripcion: 'Setup para presentación corporativa con 50 asistentes',
			tipo: 'Corporativo',
			productosIds: [3, 5, 6], // Mesa Rectangular, Sillas, Vajilla
			diseno: {
				plantillaId: 'evento-corporativo',
				plantillaNombre: 'Evento Corporativo Formal',
				elementos: [
					{
						id: 'mesa-presentacion',
						tipo: 'mesa-rectangular',
						nombre: 'Mesa Rectangular Cristal 2.5x1.2m',
						posicion: { x: 300, y: 50 },
						tamano: { ancho: 180, alto: 90 },
						color: '#20b2aa',
						icono: 'table_bar',
						rotacion: 0,
						productoServicioId: 3,
					},
					{
						id: 'sillas-auditorio-1',
						tipo: 'silla',
						nombre: 'Silla Chiavari Dorada',
						posicion: { x: 100, y: 200 },
						tamano: { ancho: 50, alto: 50 },
						color: '#ffd700',
						icono: 'event_seat',
						rotacion: 0,
						productoServicioId: 5,
					},
					{
						id: 'sillas-auditorio-2',
						tipo: 'silla',
						nombre: 'Silla Chiavari Dorada',
						posicion: { x: 200, y: 200 },
						tamano: { ancho: 50, alto: 50 },
						color: '#ffd700',
						icono: 'event_seat',
						rotacion: 0,
						productoServicioId: 5,
					},
					{
						id: 'sillas-auditorio-3',
						tipo: 'silla',
						nombre: 'Silla Chiavari Dorada',
						posicion: { x: 300, y: 200 },
						tamano: { ancho: 50, alto: 50 },
						color: '#ffd700',
						icono: 'event_seat',
						rotacion: 0,
						productoServicioId: 5,
					},
				],
				fechaGuardado: new Date().toISOString(),
				version: '1.0',
			},
		},
		{
			id: 'cumpleanos-infantil',
			nombre: 'Cumpleaños Infantil Colorido',
			descripcion: 'Setup divertido para fiestas infantiles con 80 niños',
			tipo: 'Cumpleaños Infantil',
			productosIds: [3, 5, 6], // Mesa Rectangular, Sillas, Vajilla
			diseno: {
				plantillaId: 'cumpleanos-infantil',
				plantillaNombre: 'Cumpleaños Infantil Colorido',
				elementos: [
					{
						id: 'mesa-principal-infantil',
						tipo: 'mesa-rectangular',
						nombre: 'Mesa Rectangular Cristal 2.5x1.2m',
						posicion: { x: 250, y: 400 },
						tamano: { ancho: 180, alto: 90 },
						color: '#ff6b35',
						icono: 'table_bar',
						rotacion: 0,
						productoServicioId: 3,
					},
					{
						id: 'zona-juegos',
						tipo: 'pista-baile',
						nombre: 'Zona de Juegos',
						posicion: { x: 100, y: 100 },
						tamano: { ancho: 250, alto: 200 },
						color: '#ffd700',
						icono: 'sports_esports',
						rotacion: 0,
					},
					{
						id: 'mesa-pastel',
						tipo: 'mesa-regalos',
						nombre: 'Mesa del Pastel',
						posicion: { x: 450, y: 150 },
						tamano: { ancho: 120, alto: 80 },
						color: '#e91e63',
						icono: 'cake',
						rotacion: 0,
					},
				],
				fechaGuardado: new Date().toISOString(),
				version: '1.0',
			},
		},
		{
			id: 'graduacion-elegante',
			nombre: 'Graduación Elegante',
			descripcion:
				'Configuración formal para ceremonia de graduación con 150 personas',
			tipo: 'Graduación',
			productosIds: [3, 4, 5, 6], // Mesa Rectangular, Mesa Redonda, Sillas, Vajilla
			diseno: {
				plantillaId: 'graduacion-elegante',
				plantillaNombre: 'Graduación Elegante',
				elementos: [
					{
						id: 'escenario-graduacion',
						tipo: 'escenario',
						nombre: 'Escenario',
						posicion: { x: 300, y: 50 },
						tamano: { ancho: 250, alto: 100 },
						color: '#9c27b0',
						icono: 'theater_comedy',
						rotacion: 0,
					},
					{
						id: 'mesa-diplomas',
						tipo: 'mesa-rectangular',
						nombre: 'Mesa Rectangular Cristal 2.5x1.2m',
						posicion: { x: 350, y: 180 },
						tamano: { ancho: 150, alto: 80 },
						color: '#20b2aa',
						icono: 'table_bar',
						rotacion: 0,
						productoServicioId: 3,
					},
					{
						id: 'mesas-invitados-grad-1',
						tipo: 'mesa-redonda',
						nombre: 'Mesa Redonda Madera Ø1.8m',
						posicion: { x: 100, y: 350 },
						tamano: { ancho: 120, alto: 120 },
						color: '#654321',
						icono: 'table_restaurant',
						rotacion: 0,
						productoServicioId: 4,
					},
					{
						id: 'mesas-invitados-grad-2',
						tipo: 'mesa-redonda',
						nombre: 'Mesa Redonda Madera Ø1.8m',
						posicion: { x: 300, y: 350 },
						tamano: { ancho: 120, alto: 120 },
						color: '#654321',
						icono: 'table_restaurant',
						rotacion: 0,
						productoServicioId: 4,
					},
					{
						id: 'mesas-invitados-grad-3',
						tipo: 'mesa-redonda',
						nombre: 'Mesa Redonda Madera Ø1.8m',
						posicion: { x: 500, y: 350 },
						tamano: { ancho: 120, alto: 120 },
						color: '#654321',
						icono: 'table_restaurant',
						rotacion: 0,
						productoServicioId: 4,
					},
				],
				fechaGuardado: new Date().toISOString(),
				version: '1.0',
			},
		},
		{
			id: 'baby-shower-delicado',
			nombre: 'Baby Shower Delicado',
			descripcion: 'Configuración íntima para baby shower con 60 personas',
			tipo: 'Baby Shower',
			productosIds: [4, 5, 6], // Mesa Redonda, Sillas, Vajilla
			diseno: {
				plantillaId: 'baby-shower-delicado',
				plantillaNombre: 'Baby Shower Delicado',
				elementos: [
					{
						id: 'mesa-central-baby',
						tipo: 'mesa-redonda',
						nombre: 'Mesa Redonda Madera Ø1.8m',
						posicion: { x: 300, y: 200 },
						tamano: { ancho: 130, alto: 130 },
						color: '#87ceeb',
						icono: 'table_restaurant',
						rotacion: 0,
						productoServicioId: 4,
					},
					{
						id: 'mesa-regalos-baby',
						tipo: 'mesa-regalos',
						nombre: 'Mesa de Regalos',
						posicion: { x: 150, y: 100 },
						tamano: { ancho: 130, alto: 80 },
						color: '#ffb6c1',
						icono: 'card_giftcard',
						rotacion: 0,
					},
					{
						id: 'mesa-postres-baby',
						tipo: 'mesa-rectangular',
						nombre: 'Mesa de Postres',
						posicion: { x: 500, y: 100 },
						tamano: { ancho: 140, alto: 70 },
						color: '#ffc0cb',
						icono: 'cake',
						rotacion: 0,
					},
					{
						id: 'decoracion-baby-1',
						tipo: 'planta',
						nombre: 'Decoración Floral',
						posicion: { x: 100, y: 350 },
						tamano: { ancho: 60, alto: 60 },
						color: '#98fb98',
						icono: 'local_florist',
						rotacion: 0,
					},
					{
						id: 'decoracion-baby-2',
						tipo: 'planta',
						nombre: 'Decoración Floral',
						posicion: { x: 550, y: 350 },
						tamano: { ancho: 60, alto: 60 },
						color: '#98fb98',
						icono: 'local_florist',
						rotacion: 0,
					},
				],
				fechaGuardado: new Date().toISOString(),
				version: '1.0',
			},
		},
		{
			id: 'conferencia-profesional',
			nombre: 'Conferencia Profesional',
			descripcion: 'Setup para conferencia o seminario con 200 asistentes',
			tipo: 'Corporativo',
			productosIds: [3, 5], // Mesa Rectangular, Sillas
			diseno: {
				plantillaId: 'conferencia-profesional',
				plantillaNombre: 'Conferencia Profesional',
				elementos: [
					{
						id: 'mesa-ponentes',
						tipo: 'mesa-rectangular',
						nombre: 'Mesa Rectangular Cristal 2.5x1.2m',
						posicion: { x: 300, y: 50 },
						tamano: { ancho: 200, alto: 90 },
						color: '#2c3e50',
						icono: 'table_bar',
						rotacion: 0,
						productoServicioId: 3,
					},
					{
						id: 'sillas-auditorio-fila1',
						tipo: 'silla',
						nombre: 'Silla Chiavari Dorada',
						posicion: { x: 100, y: 200 },
						tamano: { ancho: 50, alto: 50 },
						color: '#34495e',
						icono: 'event_seat',
						rotacion: 0,
						productoServicioId: 5,
					},
					{
						id: 'sillas-auditorio-fila2',
						tipo: 'silla',
						nombre: 'Silla Chiavari Dorada',
						posicion: { x: 200, y: 200 },
						tamano: { ancho: 50, alto: 50 },
						color: '#34495e',
						icono: 'event_seat',
						rotacion: 0,
						productoServicioId: 5,
					},
					{
						id: 'sillas-auditorio-fila3',
						tipo: 'silla',
						nombre: 'Silla Chiavari Dorada',
						posicion: { x: 300, y: 200 },
						tamano: { ancho: 50, alto: 50 },
						color: '#34495e',
						icono: 'event_seat',
						rotacion: 0,
						productoServicioId: 5,
					},
					{
						id: 'sillas-auditorio-fila4',
						tipo: 'silla',
						nombre: 'Silla Chiavari Dorada',
						posicion: { x: 400, y: 200 },
						tamano: { ancho: 50, alto: 50 },
						color: '#34495e',
						icono: 'event_seat',
						rotacion: 0,
						productoServicioId: 5,
					},
					{
						id: 'sillas-auditorio-fila5',
						tipo: 'silla',
						nombre: 'Silla Chiavari Dorada',
						posicion: { x: 500, y: 200 },
						tamano: { ancho: 50, alto: 50 },
						color: '#34495e',
						icono: 'event_seat',
						rotacion: 0,
						productoServicioId: 5,
					},
					{
						id: 'zona-coffee-break',
						tipo: 'zona-comida',
						nombre: 'Zona Coffee Break',
						posicion: { x: 550, y: 400 },
						tamano: { ancho: 180, alto: 120 },
						color: '#795548',
						icono: 'local_cafe',
						rotacion: 0,
					},
				],
				fechaGuardado: new Date().toISOString(),
				version: '1.0',
			},
		},
		{
			id: 'quinceanera-royal',
			nombre: 'Quinceañera Royal',
			descripcion: 'Configuración de lujo para quinceañera con 180 invitados',
			tipo: 'Quinceaños',
			productosIds: [3, 4, 5, 6], // Mesa Rectangular, Mesa Redonda, Sillas, Vajilla
			diseno: {
				plantillaId: 'quinceanera-royal',
				plantillaNombre: 'Quinceañera Royal',
				elementos: [
					{
						id: 'mesa-honor',
						tipo: 'mesa-rectangular',
						nombre: 'Mesa de Honor',
						posicion: { x: 250, y: 80 },
						tamano: { ancho: 200, alto: 100 },
						color: '#d4af37',
						icono: 'table_bar',
						rotacion: 0,
						productoServicioId: 3,
					},
					{
						id: 'mesas-invitados-q1',
						tipo: 'mesa-redonda',
						nombre: 'Mesa Redonda Madera Ø1.8m',
						posicion: { x: 100, y: 250 },
						tamano: { ancho: 120, alto: 120 },
						color: '#c0c0c0',
						icono: 'table_restaurant',
						rotacion: 0,
						productoServicioId: 4,
					},
					{
						id: 'mesas-invitados-q2',
						tipo: 'mesa-redonda',
						nombre: 'Mesa Redonda Madera Ø1.8m',
						posicion: { x: 250, y: 250 },
						tamano: { ancho: 120, alto: 120 },
						color: '#c0c0c0',
						icono: 'table_restaurant',
						rotacion: 0,
						productoServicioId: 4,
					},
					{
						id: 'mesas-invitados-q3',
						tipo: 'mesa-redonda',
						nombre: 'Mesa Redonda Madera Ø1.8m',
						posicion: { x: 400, y: 250 },
						tamano: { ancho: 120, alto: 120 },
						color: '#c0c0c0',
						icono: 'table_restaurant',
						rotacion: 0,
						productoServicioId: 4,
					},
					{
						id: 'pista-baile-q',
						tipo: 'pista-baile',
						nombre: 'Pista de Baile',
						posicion: { x: 150, y: 420 },
						tamano: { ancho: 250, alto: 180 },
						color: '#ff1493',
						icono: 'music_note',
						rotacion: 0,
					},
					{
						id: 'mesa-pastel-q',
						tipo: 'mesa-regalos',
						nombre: 'Mesa del Pastel',
						posicion: { x: 500, y: 450 },
						tamano: { ancho: 140, alto: 90 },
						color: '#ff69b4',
						icono: 'cake',
						rotacion: 0,
					},
				],
				fechaGuardado: new Date().toISOString(),
				version: '1.0',
			},
		},
	];

	getPlantillas(): Observable<PlantillaEvento[]> {
		return of(this.mockPlantillas);
	}

	getPlantillaById(id: string): Observable<PlantillaEvento | undefined> {
		return of(this.mockPlantillas.find((p) => p.id === id));
	}

	/**
	 * Obtener todas las plantillas (custom + salones)
	 *
	 * Combina las plantillas personalizadas con las plantillas de los salones
	 * para ofrecer una lista completa de opciones al crear un nuevo evento.
	 *
	 * @returns Observable<PlantillaExtendida[]> - Array de plantillas combinadas
	 */
	// getTodasLasPlantillas(): Observable<PlantillaExtendida[]> {
	// 	return combineLatest([
	// 		of(this.mockPlantillas),
	// 		this.salonesService.getPlantillasSalones(),
	// 	]).pipe(
	// 		map(([plantillasCustom, plantillasSalones]) => {
	// 			// Convertir plantillas custom a formato extendido
	// 			const customExtendidas: PlantillaExtendida[] = plantillasCustom.map(
	// 				(p) => ({
	// 					id: p.id,
	// 					nombre: p.nombre,
	// 					descripcion: p.descripcion,
	// 					tipo: p.tipo,
	// 					productosIds: p.productosIds,
	// 					diseno: p.diseno,
	// 					origen: 'custom' as const,
	// 				}),
	// 			);

	// 			// Convertir plantillas de salones a formato extendido
	// 			const salonesExtendidas: PlantillaExtendida[] = plantillasSalones.map(
	// 				(p) => ({
	// 					id: `salon-${p.plantillaId}`,
	// 					nombre: p.plantillaNombre,
	// 					descripcion: `Plantilla de salón: ${p.plantillaNombre}`,
	// 					diseno: this.convertirPlanoTemplateADisenoGuardado(p),
	// 					origen: 'salon' as const,
	// 				}),
	// 			);

	// 			return [...customExtendidas, ...salonesExtendidas];
	// 		}),
	// 	);
	// }

	/**
	 * Obtener plantilla extendida por ID
	 *
	 * Busca tanto en plantillas custom como en plantillas de salones.
	 *
	 * @param id - ID de la plantilla (puede incluir prefijo "salon-")
	 * @returns Observable<PlantillaExtendida | undefined>
	 */
	// getPlantillaExtendidaById(
	// 	id: string,
	// ): Observable<PlantillaExtendida | undefined> {
	// 	return this.getTodasLasPlantillas().pipe(
	// 		map((plantillas) => plantillas.find((p) => p.id === id)),
	// 	);
	// }

	/**
	 * Convertir PlanoTemplate a DisenoGuardado
	 *
	 * Mapea la estructura de PlanoTemplate (de salones) a DisenoGuardado
	 * para mantener compatibilidad con el resto del sistema.
	 *
	 * @param planoTemplate - Plantilla de salón
	 * @returns DisenoGuardado - Diseño en formato estándar
	 */
	// private convertirPlanoTemplateADisenoGuardado(
	// 	planoTemplate: PlanoTemplate,
	// ): DisenoGuardado {
	// 	return {
	// 		plantillaId: planoTemplate.plantillaId,
	// 		plantillaNombre: planoTemplate.plantillaNombre,
	// 		elementos: planoTemplate.elementos.map((elemento) => ({
	// 			id: elemento.id,
	// 			tipo: elemento.tipo,
	// 			nombre: elemento.nombre,
	// 			posicion: elemento.posicion,
	// 			tamano: elemento.tamano,
	// 			color: elemento.color,
	// 			icono: elemento.icono,
	// 			rotacion: elemento.rotacion,
	// 		})),
	// 		fechaGuardado: planoTemplate.fechaGuardado,
	// 		version: planoTemplate.version,
	// 	};
	// }
}
