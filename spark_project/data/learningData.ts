export interface LearningCardData {
  id: number;
  title: string;
  text: string;
  icon?: string; // Emoji or simple identifier for an icon
  image?: string; // URL or path to an image
  bgColor?: string; // Optional background color for the card, e.g., 'bg-aqua/30'
}

export const learningCards: LearningCardData[] = [
  {
    id: 1,
    title: "🌟 Welcome to FIDO Spark!",
    text: "Your exciting journey into the world of digital identity and FIDO standards begins now. Let's spark some knowledge!",
    icon: "🚀",
    bgColor: "bg-gradient-to-br from-aqua/50 to-mauve/30 backdrop-blur-sm",
  },
  {
    id: 2,
    title: "🔑 Core FIDO Principles",
    text: "Discover the fundamental concepts that make FIDO a game-changer: security, convenience, and privacy.",
    icon: "🛡️",
    bgColor: "bg-gradient-to-br from-lime/50 to-aqua/30 backdrop-blur-sm",
  },
  {
    id: 3,
    title: "🤝 Your Role in FIDO",
    text: "Understand how your contributions, whether in engineering, design, or support, help shape a more secure online world.",
    icon: "💼",
    bgColor: "bg-gradient-to-br from-mauve/50 to-primary/20 backdrop-blur-sm",
  },
  {
    id: 4,
    title: "🛠️ Tools & Technologies",
    text: "Get acquainted with the key technologies and tools we use to build and maintain FIDO-compliant solutions.",
    icon: "⚙️",
    bgColor: "bg-gradient-to-br from-primary/30 to-lime/30 backdrop-blur-sm",
  },
  {
    id: 5,
    title: "🎉 Let's Get Sparking!",
    text: "You're all set to start exploring! Dive into the learning modules or test your knowledge with our fun games.",
    icon: "💡",
    bgColor: "bg-gradient-to-br from-aqua/40 to-lime/40 backdrop-blur-sm",
  },
]; 