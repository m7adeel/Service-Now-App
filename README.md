# Service Creation Flow

This project implements a comprehensive service creation flow with multiple steps that work together seamlessly. The flow is designed to guide users through creating a new service from start to finish.

## Overview

The service creation process consists of 5 main steps:

1. **Add Client** - Create or select an existing client
2. **Create Quote** - Define services and pricing
3. **Schedule Job** - Set job details and scheduling
4. **Send Invoice** - Generate and share invoice
5. **Summary** - Review and finalize the service

## Architecture

### Store Management

The entire flow is managed by a Zustand store (`newServiceStore.ts`) that:

- Persists data across app sessions
- Manages state for all steps
- Provides validation and navigation logic
- Handles data flow between components

### Key Features

- **Step-by-step progression** with validation
- **Data persistence** across app restarts
- **Backward navigation** to edit previous steps
- **Real-time validation** to ensure data completeness
- **Consistent UI/UX** across all steps
- **Reset functionality** to start over

## Components

### NewClient.tsx
- Handles client creation and selection
- Supports both new client creation and existing client search
- Validates required fields (name, phone number)
- Auto-populates form from store data

### CreateQuote.tsx
- Manages service selection and pricing
- Calculates totals with tax
- Integrates with client data from previous step
- Provides service quantity management

### ScheduleJob.tsx
- Sets job scheduling and details
- Auto-populates location from client data
- Manages job priority and team requirements
- Calculates estimated duration from services

### SendInvoice.tsx
- Generates invoice from quote data
- Provides multiple sharing options (PDF, email, SMS, WhatsApp)
- Shows service summary and pricing
- Integrates with all previous step data

### ServiceSummary.tsx
- Final review of all collected information
- Allows editing of any previous step
- Provides finalization functionality
- Shows complete service overview

## Data Flow

```
Client → Quote → Job → Invoice → Summary
  ↓        ↓      ↓      ↓        ↓
Store → Store → Store → Store → Finalize
```

Each step:
1. Reads data from the store
2. Allows user input/modification
3. Updates the store with new data
4. Validates completion before allowing progression

## Store Structure

```typescript
interface NewServiceState {
  client: Client | null;
  quote: QuoteData;
  job: JobData;
  invoice: InvoiceData;
  currentStep: number;
  
  // Actions for data management
  setClient, updateClient;
  setQuote, updateQuote, addServiceToQuote;
  setJob, updateJob;
  setInvoice, updateInvoice;
  
  // Navigation actions
  setCurrentStep, nextStep, previousStep;
  
  // Utility actions
  resetAll, canProceedToNextStep, isStepComplete;
}
```

## Validation Rules

### Step 0 (Client)
- Name is required
- Phone number is required

### Step 1 (Quote)
- At least one service must be selected
- Quote number is required

### Step 2 (Job)
- Job title is required
- Location is required

### Step 3 (Invoice)
- Services must be available from quote

### Step 4 (Summary)
- All previous steps must be complete

## Navigation

- **Forward navigation**: Only allowed when current step is complete
- **Backward navigation**: Always allowed to completed steps
- **Step jumping**: Users can click on step indicators to navigate to completed steps
- **Manual swiping**: Disabled to enforce step-by-step progression

## Usage

### Starting a New Service
```typescript
import { useNewServiceStore } from '@/store/newServiceStore'

const { resetAll, setCurrentStep } = useNewServiceStore()

// Start fresh
resetAll()
setCurrentStep(0)
```

### Accessing Data
```typescript
const { client, quote, job, invoice } = useNewServiceStore()

// Use data in your component
if (client) {
  console.log('Client:', client.name)
}
```

### Navigation
```typescript
const { nextStep, previousStep, setCurrentStep } = useNewServiceStore()

// Move to next step
nextStep()

// Go back
previousStep()

// Jump to specific step
setCurrentStep(2)
```

## Customization

### Adding New Steps
1. Add new interface to store
2. Update validation logic
3. Add new component to PAGES array
4. Update step count and navigation logic

### Modifying Validation
Update the `canProceedToNextStep` and `isStepComplete` functions in the store to match your business requirements.

### Styling
All components use consistent styling patterns and can be customized by modifying the style objects or CSS classes.

## Error Handling

- **Validation errors**: Shown as alerts when users try to proceed without required data
- **Step locking**: Prevents navigation to incomplete steps
- **Data persistence**: Ensures no data loss during app restarts
- **Reset confirmation**: Prevents accidental data loss

## Future Enhancements

- **Backend integration**: Connect to real APIs for data persistence
- **Offline support**: Enhanced offline capabilities
- **Multi-language**: Internationalization support
- **Advanced validation**: More sophisticated business rule validation
- **Analytics**: Track user progress and completion rates
