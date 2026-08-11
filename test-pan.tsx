import { motion } from 'motion/react';
export const Test = () => <motion.div onPan={(e, info) => console.log(info)} />
