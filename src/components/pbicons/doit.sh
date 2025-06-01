#!/usr/bin/bash
declare -A map
map["xx00"]="1"
map["xx01"]="2"
map["xx02"]="3"
map["xx03"]="4"
map["xx04"]="5"
map["xx05"]="6"
map["xx06"]="7"
map["xx07"]="8"
map["xx08"]="CP"
map["xx09"]="CP2"
map["xx10"]="D"
map["xx11"]="DD"
map["xx12"]="KD"
map["xx13"]="P"
map["xx14"]="PD"
map["xx15"]="PP"
map["xx16"]="T"
map["xx17"]="CP-gbcp"
map["xx18"]="CP-2gbcp"

for file in ${!map[@]}; do
read -r -d '' header <<EOF
import { cx } from "@emotion/css";

const Icon = (props: { className?: string }) => {
const { className, ...otherProps } = props;
return(
  <svg className={cx('pbicon', 'pbicon-${map[${file}]}', className)}
    {...otherProps}
EOF

read -r -d '' footer<<EOF
)};

export default Icon;
EOF

(echo "$header" && tail -n +2 ${file} && echo "$footer") > ${map[${file}]}.tsx
done
