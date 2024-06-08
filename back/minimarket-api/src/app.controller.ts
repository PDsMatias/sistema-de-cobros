import {  Controller, Get, Post, Put, Body, Param, Response} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Producto as ProductoModel } from '@prisma/client';
import { Response as ExpressResponse } from 'express';
import * as fs from 'fs';
import * as puppeteer from 'puppeteer-core';
import * as path from 'path';

@Controller()
export class AppController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('producto/codigo/:codigo')
  async getProductoPorCodigo(@Param('codigo') codigo: string | null): Promise<ProductoModel> {
    return this.prismaService.producto.findFirst({ where: { codigo: codigo } });
  }

  @Get('productos/tipo/:tipo') 
  async getProductoPorTipo(@Param('tipo') tipo: string | null): Promise<ProductoModel[]> {
    return this.prismaService.producto.findMany({ where: { tipo: tipo } });
  }

  @Get('productos/nombre/:nombre')
  async getProductoPorNombre(@Param('nombre') nombre: string): Promise<ProductoModel> {
    console.log('Se consultó producto/nombre=' + nombre);
    return this.prismaService.producto.findUnique({ where: { nombre: String(nombre) } });
  }

  @Get('productos')
  async getAllProductos(): Promise<ProductoModel[]> {
    return this.prismaService.producto.findMany();
  }

  @Put('producto/nombre/:nombre')
  async updateProducto(
    @Param('nombre') nombre: string,

    @Body() productoData: {
      nombre : string;
      precioPorUnidad?: number;
      precioPorPeso?: number;
    }

  ): Promise<ProductoModel> {
    if (!nombre) {
      throw new Error('El nombre del producto es requerido');
    }

    // Verificar que al menos uno de los campos de precio esté presente en productoData
    if (!productoData.precioPorUnidad && !productoData.precioPorPeso) {
      throw new Error('Debes proporcionar al menos un campo de precio (precioPorUnidad o precioPorPeso)');
    }

    // Buscar el producto existente en la base de datos por nombre
    const productoExistente = await this.prismaService.producto.findUnique({ where: { nombre: String(nombre) } });

    if (!productoExistente) {
      throw new Error(`Producto con nombre ${nombre} no encontrado`);
    }

    // Actualizar el precio del producto solo si se proporciona en productoData
    const updatedProducto = await this.prismaService.producto.update({
      where: { nombre },
      data: {
        precioPorUnidad: productoData.precioPorUnidad ?? productoExistente.precioPorUnidad,
        precioPorPeso: productoData.precioPorPeso ?? productoExistente.precioPorPeso,
      },
    });

    return updatedProducto;
  }

  @Post('producto')
  async createProducto(
    @Body() productoData: {
      nombre: string;
      codigo?: string;
      precioPorUnidad?: number;
      precioPorPeso?: number;
      tipo?: string;
      cantidadUnidad: number;
      cantidadPeso: number;
    }
  ): Promise<ProductoModel> {
    const { nombre, codigo, precioPorUnidad, precioPorPeso, tipo, cantidadUnidad,cantidadPeso } = productoData;

    const precioPorUnidadValue = precioPorUnidad !== null ? precioPorUnidad : 0;
    const precioPorPesoValue = precioPorPeso !== null ? precioPorPeso : 0;

    return this.prismaService.producto.create({
      data: {
        nombre,
        codigo,
        precioPorUnidad: precioPorUnidadValue,
        precioPorPeso: precioPorPesoValue,
        tipo,
        cantidadUnidad,
        cantidadPeso
      },
    });
  }

  @Post('ticket/pdf')
async convertHtmlToPdf(@Body() body: { html: string }, @Response() res: ExpressResponse) {
  try {
    
    const navegador = await puppeteer.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\Chrome.exe'
    });
   
    const pagina = await navegador.newPage();
    await pagina.setContent(body.html);
    const pdfBuffer = await pagina.pdf({
      width: '250mm',
      height: '1000mm',
    });
    
    
    const nombrePdf = 'ticket.pdf'; 
	const rutaPdf = path.join('E:', 'MinimercadoBoro', 'Sistema-De-Cobros', 'tickets', nombrePdf);
    //const rutaPdf = 'E:\\MinimercadoBoro\\Sistema-De-Cobros\\tickets';
    
    fs.writeFileSync(rutaPdf, pdfBuffer);

    //imprimir
    const { print } = require('pdf-to-printer');
    await print(rutaPdf, { printer: 'HPRT LPQ80' });

    res.header('Content-Type', 'application/pdf');
    res.header('Content-Disposition', `attachment; filename=${nombrePdf}`);
    res.send(pdfBuffer);
    
    await navegador.close();
  } catch (error) {
    console.error('Error al ejecutar Puppeteer:', error);
  }

}}

  


