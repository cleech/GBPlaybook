DATAFILES := $(wildcard GB-Playbook-*.json)
GAMEPLANS := gameplans-2018.json gameplans-2019.json gameplans-2025.json

all: manifest.yaml $(GAMEPLANS)

manifest.json: $(DATAFILES) $(GAMEPLANS)
	../../scripts/updateManifest.sh $?

manifest.yaml: manifest.json
	yq -pjson -oyaml $< > $@

$(GAMEPLANS): %.json: %.yaml
	yq -pyaml -ojson $< > $@

$(DATAFILES:json=yaml): %.yaml: %.json
	yq -pjson -oyaml $< > $@
