#!/bin/bash
sed -i 's/ShieldCheck, Lock, Sparkles, Loader2, AlertCircle, CheckCircle/ShieldCheck, Lock, Sparkles, Loader2, AlertCircle, CheckCircle, ArrowLeft/g' src/components/AdminPanel.tsx
sed -i 's/import { motion } from '"'"'motion\/react'"'"';/import { motion } from '"'"'motion\/react'"'"';\nimport { useNavigate } from '"'"'react-router-dom'"'"';/g' src/components/AdminPanel.tsx
