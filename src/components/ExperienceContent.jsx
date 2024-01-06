import { motion } from "framer-motion";
import { Chip, Tooltip} from "@nextui-org/react";

export default function ExperienceContent({
  position,
  company,
  date,
  description,
  finish
}) {
    // const isMobile = useBre
  return (
    <div className="relative pl-8 sm:pl-32 py-6 group">
      <motion.div
        initial={{ opacity: 0.0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, bounceStiffness: 3 }}
        className="font-caveat  text-2xl text-foreground mb-1 sm:mb-0 font-bold"
      >
        {position || "The origin"}
      </motion.div>
      <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-indigo-600 after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5">
        <Tooltip content={`${date} - ${finish || 'Present'}`} >
        <motion.div
          initial={{ opacity: 0.0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, bounceStiffness: 3 }}
          className="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold uppercase w-20 h-6 mb-3 sm:mb-0 text-default-foreground bg-default rounded-full"
        >
          {finish || "May, 2020"}
        </motion.div>
        </Tooltip>
        <motion.div
          initial={{ opacity: 0.0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, bounceStiffness: 3 }}
          className="text-xl text-foreground"
        >
          {company || "Acme was founded in Milan, Italy"}
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0.0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, bounceStiffness: 3 }}
        className="text-slate-500"
      >
        {description ||
          "Pretium lectus quam id leo. Urna et pharetra pharetra massa massa. Adipiscing enim eu neque aliquam vestibulum morbi blandit cursus risus."}
      </motion.div>
    </div>
  );
}
