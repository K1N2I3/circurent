export type Language = 'en' | 'it';

export interface Translations {
  // Navigation
  nav: {
    home: string;
    myRentals: string;
    login: string;
    register: string;
    logout: string;
  };
  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    confirm: string;
    back: string;
    search: string;
    filter: string;
    all: string;
  };
  // Home page
  home: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    noItemsFound: string;
    pricePerDay: string;
    location: string;
    unlockFullAccess: string;
    signInOrSignUp: string;
    signUp: string;
    createAccountPrompt: string;
    alreadyHaveAccount: string;
    loginOrSignUp: string;
  };
  // Auth
  auth: {
    loginTitle: string;
    registerTitle: string;
    email: string;
    password: string;
    name: string;
    confirmPassword: string;
    loginButton: string;
    registerButton: string;
    loginSuccess: string;
    registerSuccess: string;
    loginError: string;
    registerError: string;
    alreadyHaveAccount: string;
    noAccount: string;
    passwordMismatch: string;
    passwordTooShort: string;
    emailRequired: string;
    passwordRequired: string;
    nameRequired: string;
  };
  // Item detail
  itemDetail: {
    backToHome: string;
    category: string;
    location: string;
    pricePerDay: string;
    available: string;
    notAvailable: string;
    loginRequired: string;
    loginPrompt: string;
    loginButton: string;
    registerButton: string;
    startDate: string;
    endDate: string;
    paymentMethod: string;
    paypal: string;
    creditCard: string;
    rentalDays: string;
    totalPrice: string;
    rentNow: string;
    selectDates: string;
    invalidDates: string;
  };
  // Payment
  payment: {
    title: string;
    rentalDetails: string;
    item: string;
    startDate: string;
    endDate: string;
    paymentMethod: string;
    totalPrice: string;
    payWithPaypal: string;
    payWithCard: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
    payButton: string;
    processing: string;
    success: string;
    error: string;
    alreadyPaid: string;
    viewRentals: string;
    demoNotice: string;
  };
  // Dashboard
  dashboard: {
    title: string;
    subtitle: string;
    noRentals: string;
    browseItems: string;
    status: {
      pending: string;
      confirmed: string;
      completed: string;
      cancelled: string;
    };
    startDate: string;
    endDate: string;
    paymentMethod: string;
    totalPrice: string;
    completePayment: string;
  };
  // Categories
  categories: {
    electronics: string;
    sports: string;
    outdoor: string;
    tools: string;
    instruments: string;
    vehicles: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'Home',
      myRentals: 'My Rentals',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      confirm: 'Confirm',
      back: 'Back',
      search: 'Search',
      filter: 'Filter',
      all: 'All',
    },
    home: {
      title: 'Welcome to CircuRent',
      subtitle: 'Rent various items, from electronics to sports equipment',
      searchPlaceholder: 'Search items...',
      noItemsFound: 'No items found matching your criteria',
      pricePerDay: '/day',
      location: 'Location',
      unlockFullAccess: 'Unlock Full Access',
      signInOrSignUp: 'Sign In or Sign Up',
      signUp: 'Sign Up',
      createAccountPrompt: 'Create an account to browse all {count}+ items and start renting premium items today!',
      alreadyHaveAccount: 'Already have an account?',
      loginOrSignUp: 'Login or Sign Up to continue browsing',
    },
    auth: {
      loginTitle: 'Sign in to your account',
      registerTitle: 'Create a new account',
      email: 'Email address',
      password: 'Password',
      name: 'Name',
      confirmPassword: 'Confirm password',
      loginButton: 'Sign in',
      registerButton: 'Register',
      loginSuccess: 'Login successful',
      registerSuccess: 'Registration successful',
      loginError: 'Login failed',
      registerError: 'Registration failed',
      alreadyHaveAccount: 'or',
      noAccount: 'or',
      passwordMismatch: 'Passwords do not match',
      passwordTooShort: 'Password must be at least 6 characters',
      emailRequired: 'Email is required',
      passwordRequired: 'Password is required',
      nameRequired: 'Name is required',
    },
    itemDetail: {
      backToHome: '← Back to home',
      category: 'Category',
      location: 'Location',
      pricePerDay: 'Daily price',
      available: '✓ Available',
      notAvailable: '✗ Not available',
      loginRequired: 'Please login or register to rent this item',
      loginPrompt: 'Please login or register to rent this item',
      loginButton: 'Login',
      registerButton: 'Register',
      startDate: 'Start date',
      endDate: 'End date',
      paymentMethod: 'Payment method',
      paypal: 'PayPal',
      creditCard: 'Credit card',
      rentalDays: 'Rental days',
      totalPrice: 'Total price',
      rentNow: 'Rent now',
      selectDates: 'Please select rental dates',
      invalidDates: 'End date must be after start date',
    },
    payment: {
      title: 'Complete payment',
      rentalDetails: 'Rental details',
      item: 'Item',
      startDate: 'Start date',
      endDate: 'End date',
      paymentMethod: 'Payment method',
      totalPrice: 'Total price',
      payWithPaypal: 'Pay with PayPal',
      payWithCard: 'Pay with card',
      cardNumber: 'Card number',
      expiryDate: 'Expiry date',
      cvv: 'CVV',
      cardholderName: 'Cardholder name',
      payButton: 'Pay',
      processing: 'Processing...',
      success: 'Payment successful!',
      error: 'Payment processing failed, please try again',
      alreadyPaid: 'This rental has already been paid',
      viewRentals: 'View my rentals',
      demoNotice: 'Note: This is a demo environment. You need to configure Stripe keys for actual payments.',
    },
    dashboard: {
      title: 'My Rentals',
      subtitle: 'Manage all your rental orders',
      noRentals: "You don't have any rental records yet",
      browseItems: 'Browse items',
      status: {
        pending: 'Pending payment',
        confirmed: 'Confirmed',
        completed: 'Completed',
        cancelled: 'Cancelled',
      },
      startDate: 'Start date',
      endDate: 'End date',
      paymentMethod: 'Payment method',
      totalPrice: 'Total price',
      completePayment: 'Complete payment',
    },
    categories: {
      electronics: 'Electronics',
      sports: 'Sports Equipment',
      outdoor: 'Outdoor Gear',
      tools: 'Tools',
      instruments: 'Instruments',
      vehicles: 'Vehicles',
    },
  },
  it: {
    nav: {
      home: 'Home',
      myRentals: 'I Miei Noleggi',
      login: 'Accedi',
      register: 'Registrati',
      logout: 'Esci',
    },
    common: {
      loading: 'Caricamento...',
      error: 'Errore',
      success: 'Successo',
      cancel: 'Annulla',
      confirm: 'Conferma',
      back: 'Indietro',
      search: 'Cerca',
      filter: 'Filtra',
      all: 'Tutti',
    },
    home: {
      title: 'Benvenuto su CircuRent',
      subtitle: 'Noleggia vari articoli, dall\'elettronica alle attrezzature sportive',
      searchPlaceholder: 'Cerca articoli...',
      noItemsFound: 'Nessun articolo trovato corrispondente ai tuoi criteri',
      pricePerDay: '/giorno',
      location: 'Posizione',
      unlockFullAccess: 'Sblocca Accesso Completo',
      signInOrSignUp: 'Accedi o Registrati',
      signUp: 'Registrati',
      createAccountPrompt: 'Crea un account per sfogliare tutti gli {count}+ articoli e iniziare a noleggiare articoli premium oggi!',
      alreadyHaveAccount: 'Hai già un account?',
      loginOrSignUp: 'Accedi o Registrati per continuare a sfogliare',
    },
    auth: {
      loginTitle: 'Accedi al tuo account',
      registerTitle: 'Crea un nuovo account',
      email: 'Indirizzo email',
      password: 'Password',
      name: 'Nome',
      confirmPassword: 'Conferma password',
      loginButton: 'Accedi',
      registerButton: 'Registrati',
      loginSuccess: 'Accesso riuscito',
      registerSuccess: 'Registrazione riuscita',
      loginError: 'Accesso fallito',
      registerError: 'Registrazione fallita',
      alreadyHaveAccount: 'o',
      noAccount: 'o',
      passwordMismatch: 'Le password non corrispondono',
      passwordTooShort: 'La password deve essere di almeno 6 caratteri',
      emailRequired: 'L\'email è obbligatoria',
      passwordRequired: 'La password è obbligatoria',
      nameRequired: 'Il nome è obbligatorio',
    },
    itemDetail: {
      backToHome: '← Torna alla home',
      category: 'Categoria',
      location: 'Posizione',
      pricePerDay: 'Prezzo giornaliero',
      available: '✓ Disponibile',
      notAvailable: '✗ Non disponibile',
      loginRequired: 'Effettua il login o registrati per noleggiare questo articolo',
      loginPrompt: 'Effettua il login o registrati per noleggiare questo articolo',
      loginButton: 'Accedi',
      registerButton: 'Registrati',
      startDate: 'Data di inizio',
      endDate: 'Data di fine',
      paymentMethod: 'Metodo di pagamento',
      paypal: 'PayPal',
      creditCard: 'Carta di credito',
      rentalDays: 'Giorni di noleggio',
      totalPrice: 'Prezzo totale',
      rentNow: 'Noleggia ora',
      selectDates: 'Seleziona le date di noleggio',
      invalidDates: 'La data di fine deve essere successiva alla data di inizio',
    },
    payment: {
      title: 'Completa il pagamento',
      rentalDetails: 'Dettagli del noleggio',
      item: 'Articolo',
      startDate: 'Data di inizio',
      endDate: 'Data di fine',
      paymentMethod: 'Metodo di pagamento',
      totalPrice: 'Prezzo totale',
      payWithPaypal: 'Paga con PayPal',
      payWithCard: 'Paga con carta',
      cardNumber: 'Numero di carta',
      expiryDate: 'Data di scadenza',
      cvv: 'CVV',
      cardholderName: 'Nome del titolare',
      payButton: 'Paga',
      processing: 'Elaborazione...',
      success: 'Pagamento riuscito!',
      error: 'Elaborazione del pagamento fallita, riprova',
      alreadyPaid: 'Questo noleggio è già stato pagato',
      viewRentals: 'Visualizza i miei noleggi',
      demoNotice: 'Nota: Questo è un ambiente demo. Devi configurare le chiavi Stripe per i pagamenti effettivi.',
    },
    dashboard: {
      title: 'I Miei Noleggi',
      subtitle: 'Gestisci tutti i tuoi ordini di noleggio',
      noRentals: 'Non hai ancora nessun record di noleggio',
      browseItems: 'Sfoglia articoli',
      status: {
        pending: 'Pagamento in sospeso',
        confirmed: 'Confermato',
        completed: 'Completato',
        cancelled: 'Annullato',
      },
      startDate: 'Data di inizio',
      endDate: 'Data di fine',
      paymentMethod: 'Metodo di pagamento',
      totalPrice: 'Prezzo totale',
      completePayment: 'Completa il pagamento',
    },
    categories: {
      electronics: 'Elettronica',
      sports: 'Attrezzature Sportive',
      outdoor: 'Attrezzatura Outdoor',
      tools: 'Utensili',
      instruments: 'Strumenti',
      vehicles: 'Veicoli',
    },
  },
};

export function getTranslations(lang: Language): Translations {
  return translations[lang];
}

export function getCategoryTranslation(lang: Language, category: string): string {
  // Map both Chinese and English category names to translation keys
  const categoryMap: Record<string, keyof Translations['categories']> = {
    // Chinese categories (legacy support)
    '电子产品': 'electronics',
    '运动器材': 'sports',
    '户外用品': 'outdoor',
    '工具': 'tools',
    '乐器': 'instruments',
    '交通工具': 'vehicles',
    // English categories (current)
    'Electronics': 'electronics',
    'Sports Equipment': 'sports',
    'Outdoor Gear': 'outdoor',
    'Tools': 'tools',
    'Instruments': 'instruments',
    'Vehicles': 'vehicles',
  };

  const categoryKey = categoryMap[category] || 'electronics';
  return translations[lang].categories[categoryKey];
}

