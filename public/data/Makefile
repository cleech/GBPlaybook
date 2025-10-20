.PHONY: FILES
FILES: manifest.yaml gameplans-2018.json gameplans-2019.json gameplans-2025.json

manifest.yaml: manifest.json
	yq -pjson -oyaml $< > $@

%.json: %.yaml
	yq -pyaml -ojson $< > $@

