export const formFields = [
    { label: 'Név', name: 'name', type: 'text' },
    { label: 'E-mail', name: 'email', type: 'text' },
    { label: 'Telefon', name: 'phone', type: 'text' },
    { label: 'Épület', name: 'building', type: 'text' },
    { label: 'Emelet', name: 'floor', type: 'text' },
    { label: 'Ajtó', name: 'door', type: 'text' },
    { label: 'Négyzetméter', name: 'squaremeter', type: 'text' },
    { label: 'Egyenleg', name: 'balance', type: 'number' },
    {
        label: 'Vízóra', name: 'hasMeter', type: 'select', options: [
            { label: 'Igen', value: 1 },
            { label: 'Nem', value: 0 }

        ]
    },
    {
        label: 'Admin', name: 'isAdmin', type: 'select', options: [
            { label: 'Nem', value: 0 },
            { label: 'Igen', value: 1 }
        ]
    }
];