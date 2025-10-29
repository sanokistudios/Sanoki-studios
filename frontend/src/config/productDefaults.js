// Valeurs par défaut pour les informations produits (identique au backend)
export const productDefaults = {
  composition: '100% COTTON TWILL. FRONT PLEATS. TONE-ON-TONE EMBROIDERY.',
  
  sizeGuide: {
    referenceModel: {
      name: 'MODEL (WHITE BACKGROUND)',
      height: '1M82',
      weight: '70KG',
      size: 'M'
    },
    sizeRange: {
      '160-170CM': 'SMALL',
      '165-180CM': 'MEDIUM',
      '175-185CM': 'LARGE',
      '185-195CM': 'XLARGE',
      '190CM-200CM': 'XXLARGE'
    }
  },
  
  washingInstructions: {
    handWash: 'TO PRESERVE EMBROIDERY, ESPECIALLY IF IT IS FINE OR INTRICATE.',
    machineWash: {
      temperature: 'MAX 30°C',
      cycle: 'DELICATE / FRAGILE LAUNDRY',
      spin: 'LOW (MAX 800 RPM)'
    }
  }
};

