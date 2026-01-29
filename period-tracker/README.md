# Period Tracker

A minimalist, elegant period tracking application built with Next.js. Track your menstrual cycle, understand patterns, and gain insights into your body—all while keeping your data completely private and stored locally on your device.

![Period Tracker](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

## ✨ Features

- **Quick Logging**: One-tap buttons to log when your period starts or ends
- **Calendar-Based Date Picker**: Intuitive calendar interface for selecting dates
- **Cycle Insights**: Automatically calculated statistics including:
  - Average cycle length
  - Average period duration
  - Cycle range (shortest to longest)
  - Predicted next period date
- **Visual Calendar**: Monthly calendar view highlighting period days and predictions
- **History Tracking**: Complete log of all tracked periods
- **Data Privacy**: All data stored locally using browser localStorage—never sent to any server
- **Export Functionality**: Download your data as JSON
- **Clean Data Management**: Clear all data with confirmation when needed

## 🎨 Design Philosophy

The app features a refined editorial design inspired by premium productivity tools:

- **Typography**: Elegant Cormorant serif headings paired with clean DM Sans body text
- **Color Palette**: Soft, organic earth tones with rose accents
- **Animations**: Sophisticated micro-interactions and smooth transitions
- **No Emojis**: Clean, professional interface focused on content
- **Responsive**: Works beautifully on all device sizes

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/period-tracker.git
cd period-tracker/period-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 📱 Usage

### Logging a Period

**Quick Log (Today)**:
- Click "Period Started Today" when your period begins
- Click "Period Ended Today" when it concludes

**Manual Log (Past Dates)**:
1. Click "Log Past Period"
2. Select start date using the calendar picker
3. Optionally select end date
4. Click "Save Period"

### Viewing Insights

Navigate to the **Overview** tab to see:
- Current period status
- Predicted next period date
- Cycle statistics and trends
- Visual calendar with period days highlighted

### Managing Data

Go to **Settings** to:
- Export your data as JSON
- Clear all data (with confirmation)

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: Custom CSS with CSS Variables
- **Storage**: Browser localStorage API
- **Fonts**: Google Fonts (Cormorant, DM Sans)

## 📁 Project Structure

```
period-tracker/
├── app/
│   ├── components/
│   │   ├── Calendar.tsx       # Monthly calendar view
│   │   ├── Dashboard.tsx      # Cycle insights display
│   │   ├── DatePicker.tsx     # Calendar date picker modal
│   │   ├── History.tsx        # Period history list
│   │   ├── PeriodForm.tsx     # Period logging interface
│   │   └── Settings.tsx       # App settings
│   ├── lib/
│   │   └── storage.ts         # localStorage utilities
│   ├── globals.css            # Global styles and design system
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Main application page
│   └── types.ts               # TypeScript type definitions
├── public/                    # Static assets
└── package.json
```

## 🔒 Privacy & Data

- **100% Local**: All data is stored in your browser's localStorage
- **No Analytics**: No tracking or analytics installed
- **No Server**: Static site with no backend—your data never leaves your device
- **Export Control**: You own your data and can export it anytime

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Sukanya Choudhury**

---

<p align="center">Made with care for personal health tracking 🌸</p>
