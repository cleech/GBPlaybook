#!/usr/bin/bash
declare -A map
map["xx34"]="burning"
map["xx33"]="bleeding"
map["xx25"]="Shepherds"
map["xx35"]="poison"
map["xx17"]="Hunters"
map["xx26"]="Union"
map["xx24"]="Ratcatchers"
map["xx18"]="Masons"
map["xx09"]="Blacksmiths"
map["xx16"]="Fishermen"
map["xx10"]="Brewers"
map["xx01"]="ball-full"
map["xx08"]="Alchemists"
map["xx02"]="trophy"
map["xx19"]="Miners"
map["xx28"]="GB"
map["xx00"]="gbcp"
map["xx27"]="Lamplighters"
map["xx37"]="disease"
map["xx36"]="snared"
map["xx03"]="ball"
map["xx29"]="GBT"
map["xx12"]="Cooks"
map["xx04"]="ballotX"
map["xx20"]="Morticians"
map["xx13"]="Engineers"
map["xx05"]="checkmark"
map["xx30"]="blank"
map["xx21"]="Navigators"
map["xx14"]="Falconers"
map["xx07"]="bandage"
map["xx22"]="Order"
map["xx06"]="skull"
map["xx31"]="Logo"
map["xx15"]="Farmers"
map["xx23"]="Order-GBCP"
map["xx32"]="knock-down"
map["xx11"]="Butchers"


for file in ${!map[@]}; do
read -r -d '' header <<EOF
import { cx } from "@emotion/css";

const Icon = (props: { className?: string }) => {
const { className, ...otherProps } = props;
return(
  <svg id="gbicon-${map[${file}]}"
    className={cx('gbicon', 'gbicon-${map[${file}]}', className)}
    {...otherProps}
    viewBox="0 0 16 16">
EOF

read -r -d '' footer<<EOF
  </svg>
)};

export default Icon;
EOF


(echo "$header" && cat ${file} && echo "$footer") > ${map[${file}]}.tsx
done
