# CapRate.io - Rental Property Cash Flow Calculator

## Overview

CapRate.io is a comprehensive web application designed to help real estate investors analyze rental property investments. The application provides detailed cash flow calculations, ROI analysis, and property valuation metrics to assist users in making informed investment decisions.

## Features

### Core Functionality
- **Property Analysis**: Calculate key real estate investment metrics
- **Cash Flow Calculations**: Monthly and annual cash flow projections
- **ROI Analysis**: Cash-on-cash return and cap rate calculations
- **Property Valuation**: Gross rent multiplier and price per square foot analysis
- **Financing Analysis**: Mortgage payment calculations and loan-to-value ratios
- **Expense Tracking**: Comprehensive operating expense management
- **Calculation History**: Save and load previous calculations
- **User Authentication**: Secure login/signup with premium features

### Key Metrics Calculated
- **Cap Rate**: Annual return on investment if bought with cash
- **Cash-on-Cash Return**: Annual return on actual cash invested
- **Gross Rent Multiplier**: Ratio of purchase price to gross rental income
- **Monthly/Annual Cash Flow**: Net income after all expenses and mortgage payments
- **Net Operating Income (NOI)**: Gross income minus operating expenses
- **Price per Square Foot**: Purchase price divided by building square footage

## Technology Stack

### Frontend
- **React 18.3.1**: Modern React with hooks and functional components
- **React Router DOM 6.23.1**: Client-side routing
- **Axios 1.7.2**: HTTP client for API communication
- **CSS3**: Custom styling with modern design patterns
- **Local Storage**: Persistent data storage for form data and calculation history

### Backend Integration
- **RESTful API**: Communicates with Node.js/Express backend
- **JWT Authentication**: Secure user authentication and authorization
- **Environment Variables**: Configurable backend URL via `REACT_APP_BACKEND_URL`

## Project Structure

```
src/
├── components/
│   ├── CashFlowForm/           # Main calculator component
│   │   ├── form_sections/      # Individual form sections
│   │   ├── helper_files/       # Reusable input components
│   │   ├── hooks/              # Custom React hooks
│   │   └── components/         # Sub-components
│   ├── LogInSignUp/            # Authentication components
│   ├── MyAccount/              # User account management
│   ├── Navbar/                 # Navigation component
│   ├── PrivateRoute/           # Route protection
│   ├── InfoTooltip/            # Help tooltips
│   └── common/                 # Shared components
├── context/
│   └── AuthContext.js          # Authentication state management
├── App.js                      # Main application component
├── App.css                     # Global styles
└── index.js                    # Application entry point
```

## Component Architecture

### Main Components

#### 1. CashFlowForm
The central component that orchestrates the entire calculation process:
- Manages form state and validation
- Coordinates between different form sections
- Handles calculation triggers and error management
- Displays results and calculation history

#### 2. Form Sections
Modular components for different aspects of property analysis:

- **PropertyInformation**: Basic property details and key metrics display
- **GrossIncome**: Rental income calculations with vacancy adjustments
- **OperatingExpenses**: Comprehensive expense tracking
- **NetOperatingIncome**: NOI calculations and display
- **CapRateAndValuation**: Property valuation metrics
- **LoanInformation**: Financing details and mortgage calculations
- **CashFlowAndROI**: Final cash flow and ROI results

#### 3. Authentication System
- **AuthContext**: Global authentication state management
- **LogIn/SignUp**: User authentication forms
- **MyAccount**: User profile and account management
- **PrivateRoute**: Route protection for authenticated users

### Custom Hooks

#### useCashFlowCalculations
Main hook that manages:
- Form data state with localStorage persistence
- Calculation history management
- Currency formatting utilities
- Form reset functionality

#### useCalculations
Core calculation engine that computes:
- Monthly and annual income calculations
- Operating expense totals
- Mortgage payment calculations
- Key investment metrics

#### useLocalStorage
Utility hook for persistent data storage:
- Automatic localStorage synchronization
- Error handling for storage operations
- JSON serialization/deserialization

## Calculation Logic

### Income Calculations
```javascript
// Monthly rental income
monthlyRentalIncome = monthlyRentPerUnit * numberOfUnits

// Vacancy loss
vacancyLoss = monthlyRentalIncome * vacancyRate

// Gross income
monthlyGrossIncome = monthlyRentalIncome - vacancyLoss
```

### Operating Expenses
```javascript
// Property management fees
propertyManagementFees = monthlyRentalIncome * propertyManagementRate

// Property taxes (monthly)
propertyTax = (propertyTaxRate * purchasePrice) / 12

// Total operating expenses
monthlyOperatingExpenses = propertyManagementFees + propertyTax + 
  landlordInsurance + hoaFees + waterAndSewer + gasAndElectricity + 
  garbage + snowRemoval + cablePhoneInternet + pestControl + 
  accountingAdvertisingLegal
```

### Mortgage Calculations
```javascript
// Down payment and loan amount
downPayment = purchasePrice * downPaymentPercentage
loanAmount = purchasePrice - downPayment

// Monthly mortgage payment (PMT formula)
monthlyRate = mortgageRate / 12
numPayments = lengthOfMortgage * 12
monthlyMortgagePayment = loanAmount * monthlyRate * 
  Math.pow(1 + monthlyRate, numPayments) / 
  (Math.pow(1 + monthlyRate, numPayments) - 1)
```

### Key Metrics
```javascript
// Net Operating Income
monthlyNOI = monthlyGrossIncome - monthlyOperatingExpenses
annualNOI = monthlyNOI * 12

// Cash Flow
monthlyCashFlow = monthlyNOI - monthlyMortgagePayment
annualCashFlow = monthlyCashFlow * 12

// Investment Metrics
capRate = annualNOI / purchasePrice
cashOnCashReturn = annualCashFlow / downPayment
grossRentMultiplier = purchasePrice / (monthlyRentalIncome * 12)
dollarPerSquareFoot = purchasePrice / squareFeet
```

## User Interface Features

### Design System
- **Color Scheme**: Dark theme with blue accents (#00b2fe)
- **Typography**: Nunito font family for modern, clean appearance
- **Layout**: Responsive design with mobile-first approach
- **Interactive Elements**: Hover effects, smooth transitions, and visual feedback

### Form Features
- **Formatted Inputs**: Number inputs with comma formatting and step controls
- **Real-time Validation**: Immediate feedback on input errors
- **Info Tooltips**: Contextual help for each input field
- **Step Buttons**: Increment/decrement controls for numeric inputs
- **Auto-save**: Form data persists in localStorage

### Results Display
- **Color-coded Results**: Green for positive values, red for negative
- **Currency Formatting**: Proper USD formatting with commas
- **Percentage Display**: Formatted percentages with appropriate decimal places
- **Responsive Layout**: Adapts to different screen sizes

## Authentication & User Management

### User Registration
- First name, last name, email, password
- City and state information
- Automatic login after successful registration

### User Login
- Email and password authentication
- JWT token management
- Automatic token refresh and persistence

### Premium Features
- Upgrade button for non-premium users
- Stripe integration for payment processing
- Premium status tracking

## Data Persistence

### Local Storage
- **Form Data**: Automatically saved as user types
- **Calculation History**: Last 10 calculations saved
- **User Preferences**: Persistent across sessions

### Backend Integration
- **User Data**: Stored in backend database
- **Calculation History**: Can be synced with backend (premium feature)
- **Premium Status**: Managed by backend

## Development Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation
```bash
# Install dependencies
npm install

# Set environment variables
# Create .env file with:
REACT_APP_BACKEND_URL=http://localhost:3001

# Start development server
npm start
```

### Available Scripts
- `npm start`: Start development server
- `npm build`: Create production build
- `npm test`: Run test suite
- `npm run deploy`: Deploy to GitHub Pages

## Deployment

### Production Build
```bash
npm run build
```

### GitHub Pages Deployment
```bash
npm run deploy
```

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

### React Optimizations
- **useCallback**: Memoized event handlers to prevent unnecessary re-renders
- **useState**: Efficient state management
- **Component Splitting**: Modular components for better performance

### Data Management
- **Local Storage**: Efficient client-side data persistence
- **Calculation Caching**: Results cached to avoid unnecessary recalculations
- **Lazy Loading**: Components loaded as needed

## Security Features

### Frontend Security
- **Input Validation**: Client-side validation for all inputs
- **XSS Protection**: React's built-in XSS protection
- **Secure Storage**: Sensitive data handled appropriately

### Authentication Security
- **JWT Tokens**: Secure token-based authentication
- **Token Persistence**: Secure localStorage token management
- **Route Protection**: Private routes require authentication

## Future Enhancements

### Planned Features
- **Property Comparison**: Compare multiple properties side-by-side
- **Market Analysis**: Integration with real estate APIs
- **Portfolio Management**: Track multiple properties
- **Export Functionality**: PDF/Excel export of calculations
- **Advanced Analytics**: More detailed financial metrics
- **Mobile App**: Native mobile application

### Technical Improvements
- **TypeScript Migration**: Add type safety
- **State Management**: Redux or Zustand for complex state
- **Testing**: Comprehensive test coverage
- **PWA Features**: Offline functionality and app-like experience

## Contributing

### Code Style
- Follow React best practices
- Use functional components with hooks
- Maintain consistent naming conventions
- Add comments for complex logic

### Component Guidelines
- Keep components focused and single-purpose
- Use custom hooks for shared logic
- Implement proper error handling
- Ensure accessibility compliance

## License

This project is proprietary software. All rights reserved.

## Support

For technical support or feature requests, please contact the development team.

---

**CapRate.io** - Making real estate investment analysis simple and accessible.