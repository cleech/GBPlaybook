.PHONY: FILES
FILES: manifest.json gameplans-2018.json gameplans-2019.json gameplans-2025.json
%.json: %.yaml
	yq -pyaml -ojson $< > $@

