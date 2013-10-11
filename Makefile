REPORTER ?= list

define print
	@echo -e "\n  \E[0;33m${1} \E[0m..";
endef

define md2html
	$(call print,"Prepare ${1} chapter")
    @echo
	@echo > "./build/chaper_${1}.md"
	@cd "docs/${1}"; \
	for file in $$(find . -regex ".*\.\(md\)" 2>/dev/null | sort); do \
		echo "    $${file}"; \
		cat "$${file}" >> "../../build/chaper_${1}.md"; \
	done; \

	@cat "./build/chaper_${1}.md" | ./bin/prepare-anchors "./build/chaper_${1}.md"

	@./node_modules/.bin/marked --gfm --tables --lang-prefix "" "./build/chaper_${1}.md" > "./build/chaper_${1}.html";
endef

all: docs

docs: clean docs-md docs-api

docs-md:
	$(call md2html,"guide")
	$(call md2html,"examples")

docs-api:
	$(call print,"Generate documentation")
	@./node_modules/.bin/jsdoc -c ./jsdoc.conf.json ./node_modules/greppy/lib ./node_modules/greppy/README.md

clean:
	$(call print,"Cleanup documentation files")
	@rm -f ./build/*.html*
	@rm -f ./build/chaper_*.md

.PHONY: test docs clean

